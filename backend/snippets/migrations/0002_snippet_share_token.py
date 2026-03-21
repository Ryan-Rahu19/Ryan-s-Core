import uuid
from django.db import migrations, models


def populate_share_tokens(apps, schema_editor):
    # Generate a unique UUID for every existing snippet
    Snippet = apps.get_model('snippets', 'Snippet')
    for snippet in Snippet.objects.all():
        snippet.share_token = uuid.uuid4()
        snippet.save(update_fields=['share_token'])


class Migration(migrations.Migration):

    dependencies = [
        # ✅ Points to the PREVIOUS migration, not itself
        ('snippets', '0001_initial'),
    ]

    operations = [
        # Step 1 — add column as nullable first (no unique constraint yet)
        migrations.AddField(
            model_name='snippet',
            name='share_token',
            field=models.UUIDField(null=True, blank=True),
        ),

        # Step 2 — fill every existing row with a unique UUID
        migrations.RunPython(populate_share_tokens, migrations.RunPython.noop),

        # Step 3 — now make it unique and non-nullable
        migrations.AlterField(
            model_name='snippet',
            name='share_token',
            field=models.UUIDField(default=uuid.uuid4, unique=True, editable=False),
        ),
    ]