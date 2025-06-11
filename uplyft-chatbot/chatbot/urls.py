from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('signup/', views.signup, name='signup'),
    path('messages/', views.get_messages,name='messages'),
    path('messages/save/', views.save_message,name='save_messages'),
]