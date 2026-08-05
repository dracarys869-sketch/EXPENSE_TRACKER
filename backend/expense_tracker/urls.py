from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def index(request):
    return JsonResponse({'status': 'online', 'message': 'Expense Tracker Backend API (Django)'})

urlpatterns = [
    path('', index),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
