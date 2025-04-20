# Wiki de ALE Engine - API de Lua

# General

## add

Uso: `add(tag:String)`

Sirve para Añadir Objetos al Estado / Sub-Estado <br/>
<sub>Solo Sirve con Objetos que son Sub-Clase de FlxBasic</sub>

Ejemplo: `add('theSprite')`

---

## remove

Uso: `remove(tag:String)`

Sirve para Remover Objetos del Estado / Sub-Estado <br/>
<sub>Solo Sirve con Objetos que ya Han Sido Añadidos, Obviamente</sub>

Ejemplo: `remove('theSprite')`

---

## insert

Uso: `insert(position:Int, tag:String)`

Similar a [add](#add), pero que Inserta el Objeto en una Posición Específica

Ejemplo: `insert(1, 'theSprite')`

---

## debugPrint

Uso: `debugPrint(text:Dynamic, ?color:FlxColor)`

Sirve para Mostrar un Texto tanto en la Pantalla como en la Consola

También cual se le Puede Asignar un Color <br/>
<sub>(Opcional)</sub>

Ejemplo: `debugPrint('ALE Engine Supremacy', colorFromName('RED'))` </br>
<sub>Se Hace Uso de las Funciones de [Color](#color)</sub>

---

## setObjectCameras

Uso: `setObjectCameras(tag:String, cameras:Array<String>)`

Sirve para Cambiar las Cámaras en donde se Muestra un Objeto

Ejemplo: `setObjectCameras('mySprite', {'camGame'})`

---

## setVariable

Uso: `setVariable(name:String, value:Dynamic)`

Sirve para Asignar una Variable al Script

Ejemplo: `setVariable('epicBool', true)`

---

## setTag

Uso: `setTag(tag:String, value:Dynamic)`

Sirve para Agregar / Alterar una Etiqueta al / del Script

Ejemplo: `setTag('epicTag', true)`

---

## switchState

Uso: `switchState(fullClassPath:String, params:Array<Dynamic>)`

Sirve para Dirigirse a Otro Estado

Ejemplo: `switchState('funkin.states.CustomState', ['CoolState'])`

---

## switchToCustomState

Uso: `switchToCustomState(name:String)`

Sirve para Dirigirse a un Estado Personalizado </br>
<sub>Si el Script del Estado no Existe, se Mostrará un Error en la Pantalla</sub>

Ejemplo: `switchToCustomState('CoolState')`

---

## openSubState

Uso: `openSubState(fullClassPath:String, params:Array<Dynamic>)`

Sirve para Abrir un Sub-Estado

Ejemplo: `openSubState('funkin.substates.CustomSubState', ['CoolSubState'])`

<sub>Solo está Disponible para Estados</sub>

---

## openCustomSubState

Uso: `openCustomSubState(name:String)`

Sirve para Abrir un Sub-Estado Personalizado </br>
<sub>Si el Script del Sub-Estado no Existe, se Mostrará un Error en la Pantalla</sub>

Ejemplo: `openCustomSubState('CoolSubState')`

<sub>Solo está Disponible para Estados</sub>

---

## close

Uso / Ejemplo: `close()`

Sirve para Cerrar el Sub-Estado Actual

<sub>Solo está Disponible para Sub-Estados</sub>

---

# Reflect

## getProperty

Uso: `getProperty(variable:String, ?allowMaps:Bool = false)`

Sirve para Obtener una Propiedad de una Variable, ya sea Propia del Script o Propia del Estado / Sub-Estado en donde se está Ejecutando

Ejemplo: `getProperty('playerIcon.scale.x')`

---

## setProperty

Uso: `setProperty(variable:String, properties:Dynamic)`

Sirve para Asignar una Propiedad de una Variable, ya sea Propia del Script o Propia del Estado / Sub-Estado en donde se está Ejecutando

Ejemplo: `setProperty('playerIcon', {scale = {x = 2, y = 2}, {x = 100, y = 100}})`

---

## getPropertyFromClass

Uso: `getPropertyFromClass(classVar:String, variable:String, ?allowMaps:Bool = false)`

Sirve para Obtener el Valor de una Variable que se Encuentra en la Clase donde se Especifique

Ejemplo: `getPropertyFromClass('core.config.ClientPrefs', 'antialiasing')`

---

## setPropertyFromClass

Uso: `setPropertyFromClass(classVar:String, variable:String, value:Dynamic, ?allowMaps:Bool = false)`

Sirve para Asignar un Valor a una Variable que se Encuentra en la Clase donde se Especifique

Ejemplo: `setPropertyFromClass('core.config.ClientPrefs', 'antialiasing', true)`

---

## getPropertyFromGroup

Uso: `getPropertyFromGroup(obj:String, index:Int, variable:Dynamic, ?allowMaps:Bool = false)`

Sirve para Obtener un Valor de un Grupo

Ejemplo: `getPropertyFromGroup('characters', 1, 'icon')`

---

## setPropertyFromGroup

Uso: `setPropertyFromGroup(obj:String, index:Int, variable:Dynamic, value:Dynamic, ?allowMaps:Bool = false)`

Sirve para Asignar un Valor en un Grupo

Ejemplo: `setPropertyFromGroup('characters', 1, 'icon', 'dad')`

---

## removeFromGroup

Uso: `removeFromGroup(obj:String, index:Int, dontDestroy:Bool = false)`

Sirve para Remover un Miembro de un Grupo

Ejemplo: `removeFromGroup('characters', 1, true)`

---

## callMethod

Uso: `callMethod(funcToRun:String, ?args:Array<Dynamic> = null)`

Sirve para Llamar a una Función y Obtener su Valor

Ejemplo: `callMethod('resyncVoices')`

---

## callMethodFromClass

Uso: `callMethodFromClass(className:String, funcToRun:String, ?args:Array<Dynamic> = null)`

Sirve para Llamar a una Función de la Clase Especificada y Obtener su Valor

Ejemplo: `callMethodFromClass('utils.CoolUtil', 'browserLoad', {'https://www.youtube.com/watch?v=dQw4w9WgXcQ'})`

---

## createInstance

Uso: `createInstance(variableToSave:String, className:String, ?args:Array<Dynamic> = null)`

Sirve para Crear una instancia de la Clase Indicada y Guardarla en una Variable/Etiqueta

Ejemplo: `createInstance('uselessIcon', 'funkin.visuals.objects.HealthIcon', {'dad'})`

---

## instanceArg

Uso: `instanceArg(instanceName:String, ?className:String = null)`

Sirve para Formatear una Cadena de Manera Específica para Indicar a las Funciones Mencionadas Anteriormente que la Cadena debe ser una Instancia </br>
<sub>Se Utiliza con `callMethod`, `callMethodFromClass`, `createInstance`, `setProperty`, `setPropertyFromGroup`, `setPropertyFromClass`</sub>

Ejemplo: `setVariable('firstCharacter', instanceArg('characters.members[0]'))`

---

# Sistema de Archivos

## pathExists

Uso: `pathExists(path:String)`

Sirve para Verificar si un Archivo / Carpeta Existe o No dentro de la Carpeta `assets` o `mods/Mod`

Ejemplo: `pathExists('data.json')`

---

## getFileContent

Uso: `getFileContent(path:String)`

Sirve para Obtener el Contenido de un Archivo

Ejemplo: `getFileContent('data.json')`

---

## createFile

Uso: `createFile(path:String, value:String)`

Sirve para Crear un Archivo dentro de la Carpeta de Tu Mod

Ejemplo: `createFile('README.txt', 'ALE Engine Supremacy')`

---

## deleteFile

Uso: `deleteFile(path:String)`

Sirve para Eliminar un Archivo que se Encuentra dentro de la Carpeta de tu Mod

Ejemplo: `deleteFile('data.json')`

---

## createFolder

Uso: `createFolder(path:String)`

Sirve para Crear una Carpeta dentro de la Carpeta de tu Mod

Ejemplo: `createFolder('extraFolder')`

---

## deleteFolder

Uso: `deleteFolder(path:String)`

Sirve para Eliminar una Carpeta dentro de la Carpeta de tu Mod

Ejemplo: `deleteFolder('extraFolder')`

---

## readFolder

Uso: `readFolder(path:String)`

Sirve para Leer una Carpeta y Obtener el Nombre de Cada uno de sus Archivos Junto con su Extensión

Ejemplo: `readFolder('data')`

---

## pathIsFolder

Uso: `pathIsFolder(path:String)`

Sirve para Saber la Ruta Indicada es o no una Carpeta

Ejemplo: `pathIsFolder('data')`

---

# FlxSprite API

## newSprite
**Uso:**
```lua
newSprite(tag:String, ?x:Float, ?y:Float, ?sprite:String)
```

Crea una Instancia de FlxSprite

**Ejemplo:**
```lua
newSprite('mySprite', 10, 10, 'menuBG')
```

---

## loadGraphic
**Uso:**
```lua
loadGraphic(tag:String, name:String, ?animated:Bool = false, ?frameWidth:Int = 0, frameHeight:Int = 0)
```

Sirve para Cargar una Imágen a un Sprite

**Ejemplo:**
```lua
loadGraphic('mySprite', 'menuBGMagenta')
```

---

## makeGraphic
**Uso:**
```lua
makeGraphic(tag:String, width:Int, height:Int, ?color:FlxColor = FlxColor.WHITE)
```

Sirve para Crear un Gráfico y Asignárselo a un Sprite

**Ejemplo:**
```lua
makeGraphic('mySprite', 100, 100, colorFromName('blue'))
```

---

## playAnimation
**Uso:**
```lua
playAnimation(tag:String, name:String, ?force:Bool, ?reversed:Bool, ?frame:Int)
```

Sirve para Reproducir una Animación que ya fue Añadida al Sprite

**Ejemplo:**
```lua
playAnimation('mySprite', 'epicAnim', true, false)
```

---

## newGradient

Uso: `newGradient(tag:String, width:Int, height:Int, colors:Array<FlxColor>, ?chunkSize:Int = 1, ?rotation:Int = 90, ?interpolate:Bool = true)`

Sirve para Crear FlxSprites que se ve como Gradiente

Ejemplo: `newGradient('myGradient', 1280, 720, {colorFromName('black'), colorFromName('transparent')}, 1, 90, true)`

---

## getSparrowAtlas

Uso: `getSparrowAtlas(tag:String, path:String)`

Sirve para Cargar un Sprite Animado que Hace uso de XML

Ejemplo: `getSparrowAtlas('mySprite', 'characters/BOYFRIEND')`

---

## addAnimationByPrefix

Uso: `addAnimationByPrefix(tag:String, name:String, prefix:String, ?frameRate:Float, ?looped:Bool, ?flipX:Bool, ?flipY:Bool)`

Sirve para Añadir una Animación a un Sprite Animado

Ejemplo: `addAnimationByPrefix('mySprite', 'epicAnim', 'epicAnim', 24, true, true, false)`

---

## addAnimationByIndices

Uso: `addAnimationByIndices(tag:String, name:String, prefix:String, indices:Array<Int>, ?frameRate:Float, ?looped:Bool, flipX:Bool, flipY:Bool)`

Sirve para Añadir una Animación a un Sprite Animado basándose en Índices

Ejemplo: `addAnimationByIndices('mySprite', 'epicAnim', 'epicAnim', {0, 12, 20}, 24, true, true, false)`

---

## updateHitbox

Uso: `updateHitbox(tag:String)`

Sirve para Actualizar la Hitbox de un Sprite

Ejemplo: `updateHitbox('mySprite')`

---

# FlxText API

## newText
**Uso:**
```lua
newText(tag:String, ?x:Float, ?y:Float, ?width:Float, ?text:String, ?size:Int)
```

Sirve para Crear una Instancia de FlxText

**Ejemplo:**
```lua
newText('myText', 10, 100, 1280, 'ALE Engine Supremacy', 24)
```

---

## applyTextMarkup
**Uso:**
```lua
applyTextMarkup(tag:String, text:String, rules:Array<Array<Dynamic>>)
```

Sirve para Asignarle Varios Colores a la Vez a un Texto

**Ejemplo:**
```lua
applyTextMarkup('myText', '*ALE* #Engine# %Supremacy%', {
  {'*', colorFromName('cyan')},
  {'#', colorFromName('red')},
  {'%', colorFromName('green')}
})
```

---

## setTextFormat
**Uso:**
```lua
setTextFormat(tag:String, ?font:String, ?size:Int, ?color:FlxColor, ?alignment:String, ?borderStyle:String, ?borderColor:FlxColor)
```

Sirve para Cambiar la Fuente, el Tamaño, el Color, la Alineación, el Estilo del borde y el Color del Borde a un Texto

**Ejemplo:**
```lua
setTextFormat('myText', 'vcr.ttf', 24, colorFromName('white'), 'center', 'shadow', colorFromName('black'))
```

---

# FlxSound API

## newSound
**Uso:**
```lua
newSound(tag:String, sound:String)
```

Sirve para Crear una Instancia de FlxSound

**Ejemplo:**
```lua
newSound('mySound', 'scrollMenu')
```

---

## playSound
**Uso:**
```lua
playSound(tag:String)
```

Sirve para Reproducir un Sonido

**Ejemplo:**
```lua
playSound('mySound')
```

---

## playMusic
**Uso:**
```lua
playMusic(sound:String)
```

Sirve para Reproducir Música en el Juego

**Ejemplo:**
```lua
playMusic('freakyMenu')
```

---

## pauseSound
**Uso:**
```lua
pauseSound(tag:String)
```

Sirve para Pausar un Sonido

**Ejemplo:**
```lua
pauseSound('mySound')
```

---

## resumeSound
**Uso:**
```lua
resumeSound(tag:String)
```

Sirve para Despausar un Sonido

**Ejemplo:**
```lua
resumeSound('mySound')
```

---

## pauseSound

Uso: `pauseSound(tag:String)`

Sirve para Pausar un Sonido

Ejemplo: `pauseSound('mySound')`

---

## resumeSound

Uso: `resumeSound(tag:String)`

Sirve para Despausar un Sonido

Ejemplo: `resumeSound('mySound')`

---

## stopSound

Uso: `stopSound(tag:String)`

Sirve para Parar un Sonido

Ejemplo: `stopSound('mySound')`

---

## playMusic

Uso: `playMusic(sound:String)`

Sirve para Reproducir Música en el Juego

Ejemplo: `playMusic('freakyMenu')`

---

## pauseMusic

Uso / Ejemplo: `pauseMusic()`

Sirve para Pausar la Música del Juego

---

## stopMusic

Uso / Ejemplo: `stopMusic()`

Sirve para Parar la Música del Juego

---

## resumeMusic

Uso / Ejemplo: `resumeMusic()`

Sirve para Despausar la Música del Juego

---

## playSoundFile

Uso: `playSoundFile`

Sirve para Correr un Sonido

Ejemplo: `playSoundFile('scrollMenu')`

---

# Color

## colorFromString

Uso: `colorFromString(color:String)`

Sirve para Obtener un Color por medio de un String que Contenga su Código Hexadecimal

Ejemplo: `colorFromString('5DE2E7')`

---

## colorFromRGB

Uso: `colorFromRGB(r:Int, g:Int, b:Int)`

Sirve para Obtener un Color por medio de su RGB

Ejemplo: `colorFromRGB(93, 226, 231)`

---

## colorFromName

Uso: `colorFromName(name:String)`

Sirve para Obtener un Color por medio de su Nombre

Ejemplo: `colorFromName('red')`

---

# FlxTween

## tween

Uso: `tween(tag:String, vars:String, valueTypes:Dynamic, duration:Float, ?options:Dynamic)`

Sirve para Crear y Correr un FlxTween

Ejemplo: `tween('myTween', 'mySprite.scale', {x = 5, y = 5}, 1, {ease = 'circInOut', type = 'pingpong'})`

---

## cancelTween

Uso: `cancelTween(tag:String)`

Sirve para Cancelar un Tween

Ejemplo: `cancelTween('myTween')`

---

# FlxTimer

## newTimer

Uso: `newTimer(tag:String)`

Sirve para Crear un FlxTimer

Ejemplo: `newTimer('myTimer')`

---

## startTimer

Uso: `startTimer(tag:String, time:Float = 1, loops:Int)`

Sirve para Correr un Timer ya Creado

Ejemplo: `startTimer('myTimer', 1, 1)`

---

## cancelTimer
**Uso:**
```lua
cancelTimer(tag:String)
```

Sirve para Cancelar un Timer que esté Corriendo

**Ejemplo:**
```lua
cancelTimer('myTimer')
```

---

## resetTimer
**Uso:**
```lua
resetTimer(tag:String, ?newTime:Float = -1)
```

Sirve para Reiniciar un Timer y Reajustar su Duración de forma Opcional

**Ejemplo:**
```lua
resetTimer('myTimer', 0.5)
```

---

## runTimer
**Uso:**
```lua
runTimer(tag:String, time:Float = 1, loops:Int = 1)
```

Sirve para Crear y Correr un Timer

**Ejemplo:**
```lua
runTimer('fastTimer', 0.5, 1)
```