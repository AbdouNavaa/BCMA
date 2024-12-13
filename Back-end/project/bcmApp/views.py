from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Files
from .serializers import FilesSerializer

class FilesViewSet(viewsets.ModelViewSet):
    queryset = Files.objects.all()
    serializer_class = FilesSerializer
    # permission_classes = [IsAuthenticated]  # Nécessite une authentification

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Associer le fichier à l'utilisateur connecté
