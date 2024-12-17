
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FilesViewSet

router = DefaultRouter()

router.register('files', FilesViewSet, basename='files')
router.register('types', FilesViewSet, basename='types')
router.register('actions', FilesViewSet, basename='actions')

urlpatterns = [
    path('api/', include(router.urls)),  # For token authentication
]
