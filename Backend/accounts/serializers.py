from rest_framework import serializers
from .models import Document, DocSection


class DocSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocSection
        fields = ['id', 'reference', 'title', 'summary', 'tags', 'order']


class DocumentSerializer(serializers.ModelSerializer):
    sections = DocSectionSerializer(many=True, read_only=True)

    class Meta:
        model = Document
        fields = [
            'id', 'title', 'source', 'convention',
            'country', 'language', 'url', 'doc_type',
            'tags', 'pdf_file', 'created_at', 'sections'
        ]