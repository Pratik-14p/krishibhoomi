# Crop catalog shortlist (not a validated agronomic model)

`POST /api/crop/recommend` authenticates the farmer, validates the core soil values, verifies that the submitted values match a saved soil report owned by that farmer, and filters `python_backend/data/master_crops.json` by selected season and the catalog pH interval.

The displayed indicator is a transparent rule score: a base catalog match plus points for overlap between the selected soil description and catalog soil-family labels, and between the supplied broad location and the catalog's prominent-region labels. It is **not** a probability of success, yield forecast, or expert-validated suitability percentage. It must not be treated as a guarantee or a planting prescription.

N, P, K and organic carbon are validated for presence and physical plausibility but are not used as scoring factors. The bundled catalog does not consistently document the laboratory method and units needed to compare these measurements across crops safely. The response lists limitations and tells the farmer to verify locally.

## Requirements for production-grade recommendations

For a production agronomic recommendation, replace or augment this shortlist with documented current recommendations from the relevant State Agricultural University/KVK or another authoritative source for the farmer's state/district and season. Store source and validity dates, define soil-test methods and units, include rainfall/irrigation and sowing-window constraints, and have the scoring method reviewed by agricultural experts. Test boundary cases and report ownership. Until those sources exist, keep the response labeled as preliminary catalog matching.
