from rest_framework import serializers
from .models import *

class FilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Files
        fields = ['id', 'pdf', 'uploaded_at', 'type', 'user']  # Inclure les nouveaux champs
        read_only_fields = ['uploaded_at', 'user']  # Champs définis automatiquement
        
class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = ['id', 'name'] 

class ActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Action
        fields = ['__all__']
