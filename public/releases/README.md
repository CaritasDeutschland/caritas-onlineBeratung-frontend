# Release Notes

Release notes can be added to this folder. They will automatically be shown to the consultant on login if they haven't been read yet.

## File Naming Convention

The filename must follow the format `YYYYMMDD001.md` where:
- `YYYYMMDD` is the **production deployment date**
- `001` is a counter (allows multiple releases per day)
- File extension must be `.md` (Markdown)

**Examples:**
- `20251211001.md` - First release on December 11, 2025
- `20251211002.md` - Second release on December 11, 2025 (e.g., hotfix)

## Configuration

All available release notes must be registered in `releases.json`:
```json
{
  "20251211001": {
    "file": "20251211001.md",
    "title": "Optional Title for Multi-Release Display"
  },
  "20230717001": {
    "file": "20230717001.md"
  }
}
