from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TestTypeViewSet, LabTestViewSet, LabMeasurementViewSet

router = DefaultRouter()
router.register(r'test-types', TestTypeViewSet, basename='testtype')
router.register(r'tests', LabTestViewSet, basename='labtest')
router.register(r'measurements', LabMeasurementViewSet, basename='labmeasurement')

urlpatterns = [
    path('', include(router.urls)),
]
