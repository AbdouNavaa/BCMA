from rest_framework import serializers
from .models import Files

class FilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Files
        fields = ['id', 'pdf', 'uploaded_at', 'type', 'user']  # Inclure les nouveaux champs
        read_only_fields = ['uploaded_at', 'user']  # Champs définis automatiquement
