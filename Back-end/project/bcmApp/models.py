from django.db import models
from django.contrib.auth.models import User  # Import du modèle utilisateur

class Type(models.Model):
    TYPE_CHOICES = [
        ('situation deploiment du FORISIEM et etat des alertes majeurs', 'situation deploiment du FORISIEM et etat des alertes majeurs'),
        ("alertes critique de l'infrastructure BCM", "alertes critique de l'infrastructure BCM"),
        ('etat anti verus et EDR ESET', 'etat anti verus et EDR ESET '),
    ]
    name = models.CharField(max_length=255, choices=TYPE_CHOICES, default='situation deploiment du FORISIEM et etat des alertes majeurs')  # Choix de type
    def __str__(self):
        return self.name
class Action(models.Model):
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=255)
    type = models.ForeignKey('Type', related_name='type', on_delete=models.SET_NULL, null=True)
    
    def __str__(self):
        return self.name
class Files(models.Model):
    pdf = models.FileField(upload_to='store/pdfs/')
    uploaded_at = models.DateTimeField(auto_now_add=True)  # Date d'ajout
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Relation avec un utilisate
    type = models.ForeignKey('Type', related_name='types', on_delete=models.SET_NULL, null=True)
    
    def __str__(self):
        return f"{self.pdf.name} ({self.type})"
