from django.db import models


class Document(models.Model):

    COUNTRY_CHOICES = [
        ('INT', 'International'),
        ('CA', 'Canada'),
        ('US', 'États-Unis'),
    ]

    TYPE_CHOICES = [
        ('convention', 'Convention'),
        ('loi', 'Loi'),
        ('guide', 'Guide'),
        ('liste', 'Liste'),
        ('avis', 'Avis aux navigateurs'),
        ('autre', 'Autre'),
    ]

    LANGUAGE_CHOICES = [
        ('fr', 'Français'),
        ('en', 'Anglais'),
    ]

    title = models.CharField(max_length=255)
    source = models.CharField(max_length=100)        # "Transport Canada", "USCG", "IMO"
    convention = models.CharField(max_length=100, blank=True)  # "SOLAS", "MARPOL", "TP14619"
    country = models.CharField(max_length=3, choices=COUNTRY_CHOICES)
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default='fr')
    url = models.URLField(blank=True)
    doc_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    tags = models.JSONField(default=list)
    pdf_file = models.FileField(upload_to='docs/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.country} - {self.language})"

    class Meta:
        ordering = ['country', 'title']


class DocSection(models.Model):

    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='sections')
    reference = models.CharField(max_length=100)     # "Chapitre II-1", "Règle 5"
    title = models.CharField(max_length=255)
    summary = models.TextField()                     # texte résumé pour moteur de recherche
    tags = models.JSONField(default=list)
    order = models.PositiveIntegerField(default=0)   # ordre d'affichage

    def __str__(self):
        return f"{self.document.title} — {self.reference}"

    class Meta:
        ordering = ['order']