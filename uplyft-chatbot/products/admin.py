"""Configures the Django admin interface for the application."""
from django.contrib import admin
from .models import Product
# Register your models here.

admin.site.register(Product)