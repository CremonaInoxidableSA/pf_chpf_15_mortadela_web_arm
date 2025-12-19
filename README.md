## Iconos y banderas

```bash
npm install react-icons --save

npm install country-flag-icons --save
```

```js
import { FiMapPin } from "react-icons/fi"; //Mapa

import { CiBellOn } from "react-icons/ci"; //Campana
import { CiMail } from "react-icons/ci"; //Mail

import { FaWeightHanging } from "react-icons/fa"; //Peso
import { FaFacebook } from "react-icons/fa"; //Facebook
import { FaLinkedin } from "react-icons/fa"; //Linkedin
import { FaRegClock } from "react-icons/fa"; //Reloj
import { FaSearch } from "react-icons/fa"; //Lupa

import { MdPrecisionManufacturing } from "react-icons/md"; //Kuka

import { BiReceipt } from "react-icons/bi"; //Receta
import { BiCabinet } from "react-icons/bi"; //Torre

import { PiArrowsDownUpFill } from "react-icons/pi"; //Flechas Up & Down
import { PiChefHat } from "react-icons/pi"; //Receta 2

import { VscAccount } from "react-icons/vsc"; //User

import { GoDotFill } from "react-icons/go"; //Punto

import { AiOutlineExclamationCircle } from "react-icons/ai"; //Circulo Exclamacion con circulo
import { HiOutlineSwitchVertical } from "react-icons/hi"; //Flechas Verticales Arriba y Abajo

import { TbCircleLetterAFilled } from "react-icons/tb"; //A
import { TbCircleLetterBFilled } from "react-icons/tb"; //B
import { TbCircleLetterCFilled } from "react-icons/tb"; //C
import { TbBowl } from "react-icons/tb"; //Molde

import { GrResources } from "react-icons/gr"; //Nivel

import { MdCancel } from "react-icons/md"; //Cancel
```

## Traducciones

```bash
npm install i18next react-i18next
```

Como usar?

```js
import { useTranslation } from 'react-i18next';

export default Ejemplo () {
  const { t } = useTranslation('NombreDelArchivo');
  <p> {t("objeto.atributo")} </p>
}
```