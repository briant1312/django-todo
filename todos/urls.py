from django.urls import path

from . import views


app_name = "todos"
urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("api/", views.TodosView.as_view(), name="create"),
    path("api/<int:pk>/", views.TodosDetailView.as_view(), name="detail"),
]
