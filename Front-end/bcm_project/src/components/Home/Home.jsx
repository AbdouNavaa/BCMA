import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import "./Home.css";
import axios from "axios";
import { useEffect, useState } from "react";
// import Stack from '@mui/material/Stack';
import SvgIcon from "@mui/material/SvgIcon";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { TextField, MenuItem, Fab, Box, Modal } from "@mui/material";
// import UploadIcon from '@mui/icons-material/Upload';
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import "bootstrap/dist/css/bootstrap.min.css";


import { format } from "date-fns"; // Pour formater la date
import notify from "../../utility/useNotifaction";
import { ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import PrimarySearchAppBar from "../../utility/AppBar";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "type", headerName: "Type", width: 420,
    valueGetter: (params) => {
      // Extraire uniquement le nom du fichier PDF

      const type = params || "";
      console.log(type)
      return type === 'SDFEAM' ? 'Situation de deploiment du FORISIEM et etat des alertes majeurs':
      type == 'ACIBCM' ? "Alertes critique de l'infrastructure BCM"
      : "Etat anti verus et EDR ESET" ; // Prend uniquement le dernier segment de l'URL
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
      return format(date, "yyyy-MM-dd HH:mm"); // Exemple : 2024-12-12 10:55
    },
  },
  // {
  //   field: 'user',
  //   headerName: 'User Name',
  //   width: 130,
  // },
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
          style={{ textDecoration: "none", color: "green" }}
        >
          Download
        </Link>

        {/* Bouton pour lire */}
        <Button color="secondary" onClick={() => handleRead(params.row)}>
          Read
        </Button>

        {/* Delete */}
        <Button color="default" 
          style={{ textDecoration: "none", color: "red" }}
          onClick={() => handleDelete(params.row)}>
          Delete
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
const handleDelete = (row) =>{
  console.log("Delete file:", row);

  // Vérifiez que l'URL PDF est disponible
  if (!row.pdf) {
    console.error("Aucune URL de fichier disponible pour ce fichier.");
    return;
  }
  
  // message de confirmation
  if (window.confirm("Are you sure you want to delete this file?")) {
    axios
    .delete(`http://127.0.0.1:8000/api/files/${row.id}/`)
    .then((response) => {
      console.log(response.data);
      setTimeout(() =>{
        window.location.reload()
      },4000)
      notify("File deleted successfully", "success");
    })
    .catch((error) => {
      console.log('Error', error);
      
      // ask if he want to go to the login page
      
    });
  }
}

// const paginationModel = { page: 0, pageSize: 5 };

export default function Home() {
  const [data, setData] = useState([]);
  const [formVisible, setFormVisible] = useState(false); // État pour afficher ou cacher le formulaire
  const [file, setFile] = useState(null); // État pour le fichier sélectionné
  const [type, setType] = useState(""); // État pour le type sélectionné
  // const [data, setData] = useState([]); // Données de la table

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

  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken); // Stockez le token dans l'état
    console.log("Token:", storedToken);
  }, []);

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
              if (
                window.confirm(
                  "You are not logged in, do you want to go to the login page?"
                )
              ) {
                navigate("/");
              }
            }
          }, 4000);
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

  useEffect(() => {
    Fetch();
  }, []);

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
              InputLabelProps={{ shrink: true, variant: "standard" }}
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

      <Paper sx={{ height: 400, width: "100%" ,mt:5}}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSizeOptions={[5, 10]}
          className="table"
          sx={{ border: 0 }}
        />
      </Paper>

      {/* Bouton flottant */}
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <Fab color="primary" onClick={handleFormToggle}>
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
