# Onboarding Videos (Flutter)

| Property | Value |
|----------|-------|
| Goal | An onboarding step can now be **images or videos**. Each step says which in a new `type` field |
| Endpoints | `GET /api/onboardings`, `GET /api/onboardings/{id}` (paths unchanged) |
| Auth | Public, no token needed |
| Breaking change | **No.** New fields are added; every existing field keeps its name and meaning |
| Builds on | The 2026-11-05 onboarding images guide (`hirz-onboarding-images.md`): 4 images per step, chosen by language and theme |

> **Release note.** Older app versions ignore `type` and would show an empty step for a video step (its image fields are `null`). Until the new app version is out, admins should keep steps as `image`. Agree the timing with the backend team before uploading video steps to production.

---

## 1. What a step contains

| `type` | Files | Used fields |
|--------|-------|-------------|
| `image` | 4 images: Arabic/English × light/dark | `image_ar_light_url`, `image_ar_dark_url`, `image_en_light_url`, `image_en_dark_url` |
| `video` | Videos per **language only** (no light/dark versions) | `video_ar_url`, `video_en_url` |

For video steps the admin chooses either **one video per language** or **one video for both languages** (`video_mode`). **The app does not need to handle the difference:** the backend always fills both `video_ar_url` and `video_en_url`:

- One video for both languages: both fields hold the same URL.
- One video per language: each field holds its own video. If the admin uploaded only one language, the other field falls back to it.

So for a video step, just pick `video_ar_url` or `video_en_url` by the app's language.

---

## 2. Response

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
      "video_mode": null,
      "video_mode_label": null,
      "image_ar_light_url": "https://herz-dashboard.am.prompita.com/storage/116/warranty-light.png",
      "image_ar_dark_url": "https://herz-dashboard.am.prompita.com/storage/117/warranty-dark.png",
      "image_en_light_url": "https://herz-dashboard.am.prompita.com/storage/201/warranty-light.png",
      "image_en_dark_url": "https://herz-dashboard.am.prompita.com/storage/202/warranty-dark.png",
      "video_ar_url": null,
      "video_en_url": null
    },
    {
      "id": 2,
      "sort_order": 2,
      "type": "video",
      "type_label": "Video",
      "video_mode": "per_language",
      "video_mode_label": "One video per language",
      "image_ar_light_url": null,
      "image_ar_dark_url": null,
      "image_en_light_url": null,
      "image_en_dark_url": null,
      "video_ar_url": "https://herz-dashboard.am.prompita.com/storage/310/scan-ar.mp4",
      "video_en_url": "https://herz-dashboard.am.prompita.com/storage/311/scan-en.mp4"
    },
    {
      "id": 3,
      "sort_order": 3,
      "type": "video",
      "type_label": "Video",
      "video_mode": "shared",
      "video_mode_label": "One video for both languages",
      "image_ar_light_url": null,
      "image_ar_dark_url": null,
      "image_en_light_url": null,
      "image_en_dark_url": null,
      "video_ar_url": "https://herz-dashboard.am.prompita.com/storage/320/organize.mp4",
      "video_en_url": "https://herz-dashboard.am.prompita.com/storage/320/organize.mp4"
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
| `type` | string | **New.** `image` \| `video` |
| `type_label` | string | **New.** Localized label (`Accept-Language`: `en` → `Image` / `Video`, `ar` → `صورة` / `فيديو`). Display/debug only; never branch on it |
| `video_mode` | string or null | **New.** `per_language` \| `shared` for video steps, `null` for image steps. Informational; the app doesn't need it (see §1) |
| `video_mode_label` | string or null | **New.** Localized label of `video_mode` |
| `image_ar_light_url` … `image_en_dark_url` | string or null | Image steps only. `null` on video steps |
| `video_ar_url` | string or null | **New.** Video steps only: video for Arabic. `null` on image steps |
| `video_en_url` | string or null | **New.** Video steps only: video for English. `null` on image steps |

- Video formats: **mp4** (H.264, recommended), webm, mov. Max 20 MB per file.
- A video step with no video at all returns both video fields as `null`. Skip it (§6).

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
  final String? videoAr, videoEn;

  const OnboardingStep({
    required this.id,
    required this.sortOrder,
    required this.type,
    this.arLight,
    this.arDark,
    this.enLight,
    this.enDark,
    this.videoAr,
    this.videoEn,
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
        videoAr: json['video_ar_url'] as String?,
        videoEn: json['video_en_url'] as String?,
      );

  /// Video steps: by language only (the backend already fills both languages).
  /// Image steps: same fallback order as the images guide.
  String? mediaFor({required bool isArabic, required bool isDark}) {
    if (isVideo) {
      return isArabic ? (videoAr ?? videoEn) : (videoEn ?? videoAr);
    }

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

The `?? videoEn` / `?? videoAr` fallback is only a safety net; the backend already does it.

---

## 4. Rendering

```dart
Widget buildStepMedia(BuildContext context, OnboardingStep step) {
  final url = step.mediaFor(
    isArabic: Localizations.localeOf(context).languageCode == 'ar',
    isDark: Theme.of(context).brightness == Brightness.dark,
  );
  if (url == null) return const SizedBox.shrink(); // step is skipped, see §6

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

---

## 5. Video rules

- **Autoplay, muted, looping.** No controls; these are short illustration clips, like animated images.
- **Theme:** videos have no light/dark versions. Place them on the theme's background color; the same video is shown in both themes.
- **Only the visible step plays.** Pause (or dispose) the controller when the user swipes away, and play when the step becomes visible again. Keep at most the current and the next step's controllers alive.
- **Preload the next step.** Initialize the next step's controller (video) or `precacheImage` (image) while the current one is shown, so swiping stays smooth.
- **Language change:** the `ValueKey(url)` above makes Flutter create a new controller when the chosen URL changes. For a "both languages" step the URL is the same, so the video keeps playing.
- **Fitting:** `BoxFit.contain`, so nothing is cropped. Don't assume a fixed size or aspect ratio.
- **Loading and errors:** show a placeholder while the video initializes, and a fallback if it fails. A failing video must never block the user from continuing onboarding.
- **Caching:** replacing a file gives it a new URL, so caching by URL is safe (e.g. `flutter_cache_manager` + `VideoPlayerController.file`). Don't store URLs permanently; fetch the list again each time onboarding is shown.
- **Platform setup:** iOS plays `https` URLs out of the box; Android needs the `INTERNET` permission (already present for API calls). webm does not play on iOS, so admins are told to upload **mp4 (H.264)**.

---

## 6. Unchanged rules

- **Empty list:** if `data` is empty, or no step has any file, skip onboarding and continue.
- **Missing file:** if `mediaFor(...)` returns `null`, skip that step.
- **Order:** steps arrive sorted by `sort_order`.

---

## 7. Testing checklist

- [ ] A step with `type: "image"` renders exactly as before
- [ ] A per-language video step plays the Arabic video in Arabic and the English video in English
- [ ] A "both languages" video step plays the same video in both languages and keeps playing on language change
- [ ] Videos autoplay muted, loop, and look right in light and dark theme
- [ ] Missing or unknown `type` is treated as `image` without a crash
- [ ] A video step with both video URLs `null` is skipped
- [ ] Swiping away pauses the video; swiping back resumes it
- [ ] A broken video URL shows the fallback and the user can still continue
- [ ] Next step (image or video) is preloaded; no blank frame when swiping
- [ ] Memory stays flat after swiping through all steps several times (controllers disposed)
