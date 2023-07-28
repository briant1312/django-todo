from django.shortcuts import get_object_or_404

from django.views import generic
from django.views.decorators.csrf import csrf_exempt

from rest_framework.response import Response
from rest_framework import status, generics

from .models import Todo
from .serializers import TodoSerializer


class IndexView(generic.ListView):
    # this overrides the assumed name of the template to be used by
    # the generic view
    template_name = "todos/index.html"
    # this changes the default name that is given to the object that is
    # passed to the template
    context_object_name = "todos_list"

    def get_queryset(self):
        """returns all of the current todos"""
        # I think whatever is returned from this is passed into
        # the context_object_name and sent to the template
        return Todo.objects.all()


class TodosView(generics.ListCreateAPIView):
    serializer_class = TodoSerializer

    def post(self, request):
        serializer = TodoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        """this will delete all todos where is_completed is set to true"""
        todos = Todo.objects.filter(is_completed=True)
        [todo.delete() for todo in todos]
        return Response(status=status.HTTP_204_NO_CONTENT)


class TodosDetailView(generics.ListCreateAPIView):
    serializer_class = TodoSerializer

    @csrf_exempt
    def patch(self, request, pk):
        todo = get_object_or_404(Todo, pk=pk)
        serializer = TodoSerializer(todo, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
