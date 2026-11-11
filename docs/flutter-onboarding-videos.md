# Onboarding Videos (Flutter)

| Property | Value |
|----------|-------|
| Goal | An onboarding step can now be **images or videos**. Each step tells you which with a new `type` field |
| Endpoints | `GET /api/onboardings`, `GET /api/onboardings/{id}` (paths unchanged) |
| Auth | Public, no token needed |
| Breaking change | **No.** Two fields are added (`type`, `type_label`). Every existing field keeps its name and meaning |
| Builds on | the 2026-11-05 onboarding images guide (backend `docs/flutter-docs/2026-11-05/hirz-onboarding-images.md`) (4 files per step, choosing by language and theme) |

> **Release note.** Older app versions ignore `type` and will try to show a video URL as an image. Until the new app version is out, admins should keep steps as `image`. Agree the timing with the backend team before uploading video steps to production.

---

## 1. Response

### `GET /api/onboardings`

Returns the active steps, already sorted by `sort_order`.

```json
{
  "success": true,
  "message": "Onboarding retrieved successfully.",
  "data": [
    {
      "id": 1,
      "sort_order": 1,
      "type": "image",
      "type_label": "Image",
      "image_ar_light_url": "https://herz-dashboard.am.prompita.com/storage/116/warranty-light.png",
      "image_ar_dark_url": "https://herz-dashboard.am.prompita.com/storage/117/warranty-dark.png",
      "image_en_light_url": "https://herz-dashboard.am.prompita.com/storage/201/warranty-light.png",
      "image_en_dark_url": "https://herz-dashboard.am.prompita.com/storage/202/warranty-dark.png"
    },
    {
      "id": 2,
      "sort_order": 2,
      "type": "video",
      "type_label": "Video",
      "image_ar_light_url": "https://herz-dashboard.am.prompita.com/storage/310/scan-ar-light.mp4",
      "image_ar_dark_url": "https://herz-dashboard.am.prompita.com/storage/311/scan-ar-dark.mp4",
      "image_en_light_url": "https://herz-dashboard.am.prompita.com/storage/312/scan-en-light.mp4",
      "image_en_dark_url": null
    }
  ]
}
```

### `GET /api/onboardings/{id}`

Returns one active step in `data`, with the same fields. An inactive or unknown id returns `404`.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Step id |
| `sort_order` | int | Display order. The list is already sorted |
| `type` | string | **New.** `image` \| `video`. Says what all 4 URLs of this step are |
| `type_label` | string | **New.** Localized label (`Accept-Language`: `en` → `Image` / `Video`, `ar` → `صورة` / `فيديو`). For display/debug only; never branch on it |
| `image_ar_light_url` | string or null | Arabic language, light theme |
| `image_ar_dark_url` | string or null | Arabic language, dark theme |
| `image_en_light_url` | string or null | English language, light theme |
| `image_en_dark_url` | string or null | English language, dark theme |

- The URL fields keep the `image_` prefix for backwards compatibility. **When `type` is `video` they are video URLs.**
- The 4 files of one step are always the same kind: a step is never half images, half videos.
- Video formats: **mp4** (H.264, recommended), webm, mov. Max 20 MB per file.
- Any URL can still be `null`; pick the file with the same fallback order as before (see §3).

---

## 2. What changed

| Before | Now |
|--------|-----|
| Every URL was an image | URLs are images when `type = image`, videos when `type = video` |
| — | `type` and `type_label` added |

Nothing was removed or renamed.

---

## 3. Model

Branch on `type`, and treat an unknown or missing value as `image` so a future type never crashes the app.

```dart
enum OnboardingMediaType { image, video }

OnboardingMediaType _parseType(Object? raw) =>
    raw == 'video' ? OnboardingMediaType.video : OnboardingMediaType.image;

class OnboardingStep {
  final int id;
  final int sortOrder;
  final OnboardingMediaType type;
  final String? arLight, arDark, enLight, enDark;

  const OnboardingStep({
    required this.id,
    required this.sortOrder,
    required this.type,
    this.arLight,
    this.arDark,
    this.enLight,
    this.enDark,
  });

  bool get isVideo => type == OnboardingMediaType.video;

  factory OnboardingStep.fromJson(Map<String, dynamic> json) => OnboardingStep(
        id: json['id'] as int,
        sortOrder: json['sort_order'] as int,
        type: _parseType(json['type']),
        arLight: json['image_ar_light_url'] as String?,
        arDark: json['image_ar_dark_url'] as String?,
        enLight: json['image_en_light_url'] as String?,
        enDark: json['image_en_dark_url'] as String?,
      );

  /// Same fallback order as the images guide:
  /// same language + same theme → same language + other theme →
  /// other language + same theme → other language + other theme.
  String? mediaFor({required bool isArabic, required bool isDark}) {
    final same = isArabic ? [arLight, arDark] : [enLight, enDark];
    final other = isArabic ? [enLight, enDark] : [arLight, arDark];
    final themeIndex = isDark ? 1 : 0;

    return same[themeIndex] ??
        same[1 - themeIndex] ??
        other[themeIndex] ??
        other[1 - themeIndex];
  }
}
```

If you already have `imageFor(...)` from the images guide, you can keep it; it returns the same URL. Renaming it to `mediaFor` just makes the intent clear.

---

## 4. Rendering

```dart
Widget buildStepMedia(BuildContext context, OnboardingStep step) {
  final url = step.mediaFor(
    isArabic: Localizations.localeOf(context).languageCode == 'ar',
    isDark: Theme.of(context).brightness == Brightness.dark,
  );
  if (url == null) return const SizedBox.shrink(); // step is skipped, see §5

  return step.isVideo
      ? OnboardingVideo(key: ValueKey(url), url: url)
      : Image.network(url, fit: BoxFit.contain);
}
```

A minimal video widget with [`video_player`](https://pub.dev/packages/video_player):

```dart
class OnboardingVideo extends StatefulWidget {
  const OnboardingVideo({super.key, required this.url});
  final String url;

  @override
  State<OnboardingVideo> createState() => _OnboardingVideoState();
}

class _OnboardingVideoState extends State<OnboardingVideo> {
  late final VideoPlayerController _controller;
  bool _failed = false;

  @override
  void initState() {
    super.initState();
    _controller = VideoPlayerController.networkUrl(Uri.parse(widget.url))
      ..setLooping(true)
      ..setVolume(0);
    _controller.initialize().then((_) {
      if (mounted) setState(() => _controller.play());
    }).catchError((_) {
      if (mounted) setState(() => _failed = true);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_failed) return const Icon(Icons.broken_image_outlined);
    if (!_controller.value.isInitialized) {
      return const Center(child: CircularProgressIndicator());
    }
    return FittedBox(
      fit: BoxFit.contain,
      child: SizedBox(
        width: _controller.value.size.width,
        height: _controller.value.size.height,
        child: VideoPlayer(_controller),
      ),
    );
  }
}
```

### Video rules

- **Autoplay, muted, looping.** No controls; these are short illustration clips, like animated images.
- **Only the visible step plays.** Pause (or dispose) the controller when the user swipes away, and play when the step becomes visible again. Keep at most the current and the next step's controllers alive.
- **Preload the next step.** Initialize the next step's controller (video) or `precacheImage` (image) while the current one is shown, so swiping stays smooth.
- **Rebuild on language/theme change.** The `ValueKey(url)` above makes Flutter create a new controller when the chosen URL changes.
- **Fitting:** `BoxFit.contain`, so nothing is cropped. Don't assume a fixed size or aspect ratio.
- **Loading and errors:** show a placeholder while the video initializes, and a fallback if it fails. A failing video must never block the user from continuing onboarding.
- **Caching:** replacing a file gives it a new URL, so caching by URL is safe (e.g. `flutter_cache_manager` + `VideoPlayerController.file`). Don't store URLs permanently; fetch the list again each time onboarding is shown.
- **Platform setup:** iOS plays `https` URLs out of the box; Android needs the `INTERNET` permission (already present for API calls). webm does not play on iOS, so admins are told to upload **mp4 (H.264)**.

---

## 5. Unchanged rules

- **Empty list:** if `data` is empty, or no step has any file, skip onboarding and continue.
- **Missing file:** if `mediaFor(...)` returns `null`, skip that step.
- **Order:** steps arrive sorted by `sort_order`.

---

## 6. Testing checklist

- [ ] A step with `type: "image"` renders as before
- [ ] A step with `type: "video"` autoplays muted and loops
- [ ] Missing or unknown `type` is treated as `image` without a crash
- [ ] Swiping away pauses the video; swiping back resumes it
- [ ] Changing language or theme switches to the matching video
- [ ] A missing video URL follows the fallback order without an error
- [ ] A broken video URL shows the fallback and the user can still continue
- [ ] Next step (image or video) is preloaded; no blank frame when swiping
- [ ] Memory stays flat after swiping through all steps several times (controllers disposed)
