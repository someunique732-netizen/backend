from rest_framework.permissions import BasePermission
from .models import SalesPerson

class IsAdminOrManager(BasePermission):
    """Allows access only to SalesPersons with role admin or manager."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        try:
            sp = SalesPerson.objects.get(email=request.user.email)
            return sp.role in ('admin', 'manager') and sp.is_active
        except SalesPerson.DoesNotExist:
            return False