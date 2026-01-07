from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from django.contrib.auth import update_session_auth_hash
from .models import User, PharmacySettings
from .serializers import UserSerializer, UserRegistrationSerializer, ChangePasswordSerializer
from .serializers_settings import PharmacySettingsSerializer


class IsAdminOrManager(BasePermission):
    """
    Custom permission to only allow admins and managers to access.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['admin', 'manager']


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # Only admins and managers can list, create, update, delete users
        if self.action in ['list', 'create', 'update', 'partial_update', 'destroy']:
            return [IsAdminOrManager()]
        return super().get_permissions()

    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        
        # For PUT/PATCH, allow users to update their own profile
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({'old_password': 'Wrong password.'}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            update_session_auth_hash(request, user)
            return Response({'message': 'Password updated successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer


class PharmacySettingsViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing pharmacy settings.
    Only admins and managers can access.
    """
    serializer_class = PharmacySettingsSerializer
    permission_classes = [IsAuthenticated, IsAdminOrManager]
    http_method_names = ['get', 'put', 'patch']  # Only allow get and update, no create/delete
    
    def get_queryset(self):
        return PharmacySettings.objects.all()
    
    def get_object(self):
        """Always return or create the singleton pharmacy settings"""
        return PharmacySettings.get_settings()
    
    def list(self, request, *args, **kwargs):
        """Return the singleton pharmacy settings"""
        settings = self.get_object()
        serializer = self.get_serializer(settings)
        return Response(serializer.data)
    
    def update(self, request, *args, **kwargs):
        """Update pharmacy settings"""
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get('partial', False))
        serializer.is_valid(raise_exception=True)
        serializer.save(updated_by=request.user)
        return Response(serializer.data)
    
    def partial_update(self, request, *args, **kwargs):
        """Partial update of pharmacy settings"""
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
