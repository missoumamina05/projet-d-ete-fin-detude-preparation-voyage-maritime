from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Document, DocSection
from .serializers import DocumentSerializer, DocSectionSerializer


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'source', 'convention', 'tags', 'doc_type']
    ordering_fields = ['country', 'language', 'created_at']

    def get_queryset(self):
        queryset = Document.objects.all()
        country = self.request.query_params.get('country')
        language = self.request.query_params.get('language')
        doc_type = self.request.query_params.get('doc_type')

        if country:
            queryset = queryset.filter(country=country)
        if language:
            queryset = queryset.filter(language=language)
        if doc_type:
            queryset = queryset.filter(doc_type=doc_type)

        return queryset

    @action(detail=True, methods=['get'])
    def sections(self, request, pk=None):
        document = self.get_object()
        sections = document.sections.all()
        serializer = DocSectionSerializer(sections, many=True)
        return Response(serializer.data)


class DocSectionViewSet(viewsets.ModelViewSet):
    queryset = DocSection.objects.all()
    serializer_class = DocSectionSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'summary', 'reference', 'tags']