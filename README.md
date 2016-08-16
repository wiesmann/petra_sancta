# Petra Sancta

This javascript library offers a primitive way to convert a color image into a black and white image using hieraldry hatchings to represent colours. 

The patterns are these defined by [Sylvestro de Petra Sancta](https://en.wikipedia.org/wiki/Silvester_Petra_Sancta) with extensions described on the [French Wikipedia page on the subject](https://fr.wikipedia.org/wiki/Couleur_(héraldique)).

The code does no image pre-processing and just substitutes certain colour ranges with the relevant hatching. 

The library understands the following color/hatchings:

* red (gueule) with pattern ▥
* blue (azure) with pattern ▤
* yellow (or) with pattern ▒
* green (sinople) with pattern ▧
* purple (pourpre) with pattern ▨
* brown (tenné) with pattern ▥ + ▧
* dark red (sanguine) with pattern ▤ + ▨
* dark purple (mure) with pattern ▨ + ▧
* gray (acier) with pattern of alternating -⃞ and ︲⃞
* orange with pattern of alternating ︲⃞ and .⃞
* skin (carnation) with a diagonal pattern of ︲⃞ 

The color selection algorithm is pretty simple, and has some trouble distinguishing orange and brown, but generally it works with classical flags.
