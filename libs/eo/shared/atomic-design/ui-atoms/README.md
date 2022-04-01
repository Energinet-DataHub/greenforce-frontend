# Energy Origin atomic design atoms

## Media atom

The Media atom represent the classical OOCSS Media object.

### Usage

```html
<eo-media [eoMediaGapPixels]="40" [eoMediaMaxWidthPixels]="960">
  <img
    eoMediaImage
    eoMediaImageAlign="end"
    [eoMediaImageMaxWidthPixels]="540"
    alt="Example image"
  />
  <!-- Any content can be added as siblings to the element with an -->
  <!-- `eoMediaImage` directive -->
  <h1>Example title</h1>
  <p>Example copy</p>
</eo-media>
```
