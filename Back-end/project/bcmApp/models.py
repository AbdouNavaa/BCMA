from django.db import models
from django.contrib.auth.models import User  # Import du modèle utilisateur

class Files(models.Model):
    pdf = models.FileField(upload_to='store/pdfs/')
    uploaded_at = models.DateTimeField(auto_now_add=True)  # Date d'ajout
    TYPE_CHOICES = [
        ('SDFEAM', 'situation deploiment du FORISIEM et etat des alertes majeurs'),
        ("ACIBCM", "alertes critique de l'infrastructure BCM"),
        ('EAVEE', 'etat anti verus et EDR ESET '),
    ]
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='type1')  # Choix de type
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Relation avec un utilisate
    def __str__(self):
        return f"{self.pdf.name} ({self.type})"
