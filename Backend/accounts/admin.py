from django.contrib import admin
from django import forms
from .models import Document, DocSection
from .utils import extract_sections_from_pdf
import json


class DocumentAdminForm(forms.ModelForm):
    tags = forms.CharField(initial='[]', required=False)

    def clean_tags(self):
        data = self.cleaned_data.get('tags', '[]')
        if not data:
            return []
        try:
            return json.loads(data)
        except json.JSONDecodeError:
            raise forms.ValidationError("Format invalide. Utilise [] ou [\"tag1\", \"tag2\"]")

    class Meta:
        model = Document
        fields = '__all__'


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    form = DocumentAdminForm
    list_display = ['title', 'source', 'country', 'language', 'doc_type', 'created_at']
    list_filter = ['country', 'language', 'doc_type']
    search_fields = ['title', 'source', 'convention']

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)

        # Si un PDF est uploadé → extraire les sections automatiquement
        if obj.pdf_file and not change:
            try:
                sections = extract_sections_from_pdf(obj.pdf_file.path)
                for section_data in sections:
                    DocSection.objects.create(document=obj, **section_data)
                self.message_user(request, f"✅ {len(sections)} sections extraites automatiquement !")
            except Exception as e:
                self.message_user(request, f"⚠️ Extraction échouée : {e}", level='warning')


@admin.register(DocSection)
class DocSectionAdmin(admin.ModelAdmin):
    list_display = ['reference', 'title', 'document', 'order']
    search_fields = ['title', 'reference', 'summary']