import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import "./Home.css";
import axios from "axios";
import { forwardRef, useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import Tooltip from '@mui/material/Tooltip';
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { TextField, MenuItem, Fab, Box, Modal } from "@mui/material";
// import UploadIcon from '@mui/icons-material/Upload';
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import "bootstrap/dist/css/bootstrap.min.css";
import { format } from "date-fns"; // Pour formater la date
import notify from "../../utility/useNotifaction";
import { ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import PrimarySearchAppBar from "../../utility/AppBar";

import { dayjs } from 'dayjs'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { grey } from '@mui/material/colors';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const paginationModel = { page: 0, pageSize: 5 };

export default function Home() {
  const [data, setData] = useState([]);
  const [isSelect, setIsSelect] = useState(false);
  const [showfilter, setshowFilter] = useState(false);
  const [formVisible, setFormVisible] = useState(false); // État pour afficher ou cacher le formulaire
  const [file, setFile] = useState(null); // État pour le fichier sélectionné
  const [type, setType] = useState(""); // État pour le type sélectionné
  // const [data, setData] = useState([]); // Données de la table

  const columns = [
    {
      field: "id", headerName: "ID", width: 70,
      // valueGetter: (params) => {
      //   // Extraire uniquement le nom du fichier PDF

      //   console.log('params: ' + params);

      //   return params; // Prend uniquement le dernier segment de l'URL
      // },
    },
    {
      field: "type", headerName: "Type", width: 450,
      valueGetter: (params) => {
        // Extraire uniquement le nom du fichier PDF

        const type = params || "";
        // console.log(type)
        return type === 'SDFEAM' ? 'Situation de deploiment du FORISIEM et etat des alertes majeurs' :
          type == 'ACIBCM' ? "Alertes critique de l'infrastructure BCM"
            : "Etat anti verus et EDR ESET"; // Prend uniquement le dernier segment de l'URL
      },

    },
    {
      field: "pdf",
      headerName: "File name",
      width: 200,
      valueGetter: (params) => {
        // Extraire uniquement le nom du fichier PDF

        const pdfPath = params || "";
        return pdfPath.split("/").pop(); // Prend uniquement le dernier segment de l'URL
      },
    },
    {
      field: "uploaded_at",
      headerName: "Upload date",
      type: "DateTime",
      width: 150,
      valueGetter: (params) => {
        // Formater la date et l'heure
        const date = new Date(params);
        return format(date, "yyyy/MM/dd HH:mm"); // Exemple : 2024-12-12 10:55
      },
    },

    {
      field: "actions",
      headerName: "Actions",
      description: "Télécharger ou lire le fichier",
      sortable: false,
      width: 250,
      renderCell: (params) => (
        <Stack direction="row" spacing={2}>
          {/* Bouton pour télécharger */}
          <Link
            component="button"
            onClick={() => handleDownload(params.row)}
            style={{ textDecoration: "none", color: "grey" }}
          >
            {/* <Tooltip title="Download" color="success"> */}
            <Tooltip title="Download" >
              <IconButton>
                <DownloadOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Link>

          {/* Bouton pour lire */}
          <Button color="secondary" onClick={() => handleRead(params.row)}>
            <Tooltip title="Open" color="">{/*secondary*/}
              <IconButton>
                <FileOpenOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Button>

          {/* Delete */}
          <Button color="error"
            onClick={() => handleClickOpen(params.row)}>
            <Tooltip title="Delete" color="">{/*error*/}
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Button>
        </Stack>
      ),
    },
  ];

  const handleDownload = async (row) => {
    try {
      console.log("Download file:", row);

      // Requête pour obtenir le fichier en tant que Blob
      const response = await axios.get(row.pdf, {
        responseType: "blob", // Important pour indiquer que la réponse est un Blob
      });

      // Créer un URL Blob
      const url = window.URL.createObjectURL(response.data);

      // Créer un lien pour le téléchargement
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${row.id}.pdf`); // Nom du fichier
      document.body.appendChild(link);

      link.click(); // Simuler un clic

      // Ne pas supprimer le fichier après téléchargement
      notify("File downloaded successfully!", "success");
    } catch (error) {
      notify("Error downloading file:", "error");
      console.error("Error downloading file:", error);
    }
  };

  const handleRead = (row) => {
    console.log("Read file:", row);

    // Vérifiez que l'URL PDF est disponible
    if (!row.pdf) {
      console.error("Aucune URL de fichier disponible pour ce fichier.");
      return;
    }

    // Ouvrir le fichier dans un nouvel onglet
    window.open(row.pdf, "_blank");
  };
  // delete
  const handleDelete = (row) => {
    console.log("Delete file:", row);

    // Vérifiez que l'URL PDF est disponible
    if (!row.pdf) {
      console.error("Aucune URL de fichier disponible pour ce fichier.");
      return;
    }

    // message de confirmation
    axios
      .delete(`http://127.0.0.1:8000/api/files/${row.id}/`)
      .then((response) => {
        console.log(response.data);
        setTimeout(() => {
          window.location.reload()
        }, 2000)
        notify("File deleted successfully", "success");
      })
      .catch((error) => {
        console.log('Error', error);

        // ask if he want to go to the login page


      });
    setOpen(false);
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleFormToggle = () => {
    setFormVisible(!formVisible);
  };
  const navigate = useNavigate();


  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken); // Stockez le token dans l'état
    console.log("Token:", storedToken);
    Fetch();
    console.log(open);
  }, []);

  const [open1, setOpen1] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault();

    if (file && type) {
      const formData = new FormData();
      formData.append("pdf", file); // Ajoutez le fichier
      formData.append("type", type); // Ajoutez le type

      axios
        .post("http://127.0.0.1:8000/api/files/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          Fetch();
          handleFormToggle();
          setFile(null);
          setType("");
          notify("File uploaded successfully", "success");
        })
        .catch((error) => {
          console.error(error.response.data.messages[0]);
          notify(error.response.data.messages[0].message, "error");
          // ask if he want to go to the login page
          setTimeout(() => {
            if (error.response.status === 401) {
              localStorage.removeItem("token");
              // ask
              setFormVisible(false);
              setOpen1(true);

            }
          }, 2000);
        });
    } else {
      alert("Please select a file and a type");
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    height: 400,
    bgcolor: "background.paper",
    boxShadow: 1,
    px: 2,
    py: 8,
    borderRadius: "8px",
  };
  const Fetch = () => {
    axios
      .get("http://127.0.0.1:8000/api/files/")
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);

  const handleClickOpen = (id) => {
    console.log("FileId");

    setOpen(true);
    setId(id);
  };

  const handleClose = () => {
    setOpen(false);
    setOpen1(false);
  };
  const types = [
    {
      value: 'SDFEAM',
      label: 'Situation de deploiment du FORTISIEM',
    },
    {
      value: 'ACIBCM',
      label: "Alertes critique de l'infrastructure BCM",
    },
    {
      value: 'EAVEE',
      label: 'Etat anti verus et EDR ESET',
    }
  ];

  const handleTypeSelected = (type) => {
    console.log("Type :", type);

    // fetch data for the selected type
    axios
      .get("http://127.0.0.1:8000/api/files/")
      .then((response) => {
        setData(response.data.filter((item) => item.type === type));
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    // setData(data.filter((item) => item.type === type));
  }

  const normalizeDate = (date, endOfDay = false) => {
    const normalized = new Date(date);
    if (endOfDay) {
      normalized.setHours(23, 59, 59, 999);
    } else {
      normalized.setHours(0, 0, 0, 0);
    }
    return normalized;
  };

  const [dateDeb, setDateDeb] = useState(null);
  const [dateFin, setDateFin] = useState(null);

  const filterFiles = () => {
    if (!dateDeb || !dateFin) return; // Si l'une des dates est manquante, ne pas continuer.

    axios
      .get("http://127.0.0.1:8000/api/files/")
      .then((response) => {
        const filteredData = response.data.filter((item) => {
          const uploadedAt = normalizeDate(new Date(item.uploaded_at));
          return uploadedAt >= normalizeDate(dateDeb) && uploadedAt <= normalizeDate(dateFin, true);
        });

        setData(filteredData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDateDebChange = (event) => {
    console.log(event);

    const selectedDate = new Date(event.$y, event.$M, event.$D);
    setDateDeb(selectedDate);
    // filterFiles(); // Appeler la fonction pour effectuer le filtrage.
  };

  const handleDateFinChange = (event) => {
    const selectedDate = new Date(event.$y, event.$M, event.$D);
    setDateFin(selectedDate);
    // filterFiles(); // Appeler la fonction pour effectuer le filtrage.
  };


  return (
    <div className="my-container">
      <PrimarySearchAppBar />


      {/* Modal for Form */}
      <Modal open={formVisible} onClose={handleFormToggle}>
        <Box sx={style}>
          <h4 className="text-center mb-4">Upload File</h4>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}

          >
            <TextField
              type="file"
              onChange={handleFileChange}
            // InputLabelProps={{ shrink: true, variant: "standard" }}

            />
            <TextField
              select
              label="Type"
              value={type}
              onChange={handleTypeChange}
              variant="outlined"
            >
              <MenuItem value="SDFEAM">
                situation deploiment du FORISIEM et etat des alertes majeurs
              </MenuItem>
              <MenuItem value="ACIBCM">
                alertes critique de l'infrastructure BCM
              </MenuItem>
              <MenuItem value="EAVEE">etat anti verus et EDR ESET </MenuItem>
            </TextField>
            <Button variant="contained" color="dark" type="submit">
              Submit
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Dialog */}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Confirmation"}</DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete this file?.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => handleDelete(id)}>Agree</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open1}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Confirmation"}</DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            You are not logged in, do you want to go to the login page?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => navigate("/")}>Agree</Button>
        </DialogActions>
      </Dialog>
      {/* End Dialog */}


      <Paper sx={{ height: 450, width: "100%", mt: 3 }}>
          <div className=" float-start mt-2">
            <Button variant="text" color="dark" className="" > <FilterAltOutlinedIcon color="action" onClick={() => setshowFilter(!showfilter)}/></Button>
          </div>
        {showfilter &&<div style={{backgroundColor: '#fff', padding: '10px', display: 'flex',}}>
          <TextField 
            // id="outlined-select-currency"
            select 

            // label="Select"
            defaultValue="SDFEAM"
            // variant="standard"
            // helperText="Please select type"
            onChange={(e) => handleTypeSelected(e.target.value)}
            className="ms-3 float-start"
          >
            {types.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>


          <LocalizationProvider dateAdapter={AdapterDayjs}  >
            <DatePicker className="mx-3 " onChange={(e) => handleDateDebChange(e)} label='Start' />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs} >
            <DatePicker className="mx-3 " onChange={(e) => handleDateFinChange(e)} label='End' />
          </LocalizationProvider>

          <Button onClick={() => filterFiles()} variant="text" color="dark" className="py-3 px-5 " >Filter</Button>
        
        </div>}

        <DataGrid
          rows={data}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          className="table"
          sx={{ border: 0 }}
        // checkboxSelection={isSelect}
        />
      </Paper>

      {/* Bouton flottant */}
      <Box 
        sx={{
          position: "fixed",
          bottom: -13,
          right: 600,
        }}
      >
        <Fab color="info"
          sx={(theme) => ({
            position: 'absolute',
            
            bottom: theme.spacing(2),
            right: theme.spacing(2),
          })} onClick={handleFormToggle}>
          {formVisible ? <CloseIcon /> : <AddIcon />}
        </Fab>
      </Box>
      {/* <Box
        sx={{
          position: "fixed",
          bottom: 16,
          left: 16,
        }}
      >
        <Fab color="primary" onClick={Logout}>
          <ExitToAppIcon />
        </Fab>
      </Box> */}
      <ToastContainer />
    </div>
  );
}
