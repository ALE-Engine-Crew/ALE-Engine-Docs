# ALE Engine - API de Lua

Bienvenido a la documentación de la API de Lua para ALE Engine. Aquí encontrarás una referencia completa y ejemplos prácticos para crear y modificar mods de manera eficiente y flexible.

---

# General

## `add(tag: String)`
Agrega un objeto al Estado o Sub-Estado.<br>
<sub>Solo funciona con objetos que sean subclase de FlxBasic.</sub>

**Ejemplo:**  
```lua
add('theSprite')
```

---

## `remove(tag: String)`
Elimina un objeto previamente añadido al Estado o Sub-Estado.<br>
<sub>Solo funciona con objetos que ya han sido añadidos.</sub>

**Ejemplo:**  
```lua
remove('theSprite')
```

---

## `insert(position: Int, tag: String)`
Inserta un objeto en una posición específica dentro del Estado o Sub-Estado.

**Ejemplo:**  
```lua
insert(1, 'theSprite')
```

---

## `debugPrint(text: Dynamic, ?color: FlxColor)`
Muestra un texto en pantalla y en la consola.  
Puedes asignar un color opcional.

**Ejemplo:**  
```lua
debugPrint('ALE Engine Supremacy', colorFromName('RED'))
```
<sub>Utiliza funciones de [Color](#color)</sub>

---

## `setObjectCameras(tag: String, cameras: Array<String>)`
Cambia las cámaras en las que se muestra un objeto.

**Ejemplo:**  
```lua
setObjectCameras('mySprite', {'camGame'})
```

---

## `setVariable(name: String, value: Dynamic)`
Asigna una variable al script.

**Ejemplo:**  
```lua
setVariable('epicBool', true)
```

---

## `setTag(tag: String, value: Dynamic)`
Agrega o modifica una etiqueta en el script.

**Ejemplo:**  
```lua
setTag('epicTag', true)
```

---

## `switchState(fullClassPath: String, params: Array<Dynamic>)`
Cambia a otro estado.

**Ejemplo:**  
```lua
switchState('funkin.states.CustomState', ['CoolState'])
```

---

## `switchToCustomState(name: String)`
Cambia a un estado personalizado.<br>
<sub>Si el script no existe, se mostrará un error.</sub>

**Ejemplo:**  
```lua
switchToCustomState('CoolState')
```

---

## `openSubState(fullClassPath: String, params: Array<Dynamic>)`
Abre un sub-estado.

**Ejemplo:**  
```lua
openSubState('funkin.substates.CustomSubState', ['CoolSubState'])
```
<sub>Solo disponible para estados.</sub>

---

## `openCustomSubState(name: String)`
Abre un sub-estado personalizado.<br>
<sub>Si el script no existe, se mostrará un error.</sub>

**Ejemplo:**  
```lua
openCustomSubState('CoolSubState')
```
<sub>Solo disponible para estados.</sub>

---

## `close()`
Cierra el sub-estado actual.<br>
<sub>Solo disponible para sub-estados.</sub>

**Ejemplo:**  
```lua
close()
```

---

# Reflect

## getProperty

Uso: `getProperty(variable:String, ?allowMaps:Bool = false)`

Sirve para Obtener una Propiedad de una Variable, ya sea Propia del Script o Propia del Estado / Sub-Estado en donde se está Ejecutando

Ejemplo: `getProperty('playerIcon.scale.x')`

---

## setProperty

Uso: `setProperty(variable:String, value:Dynamic, allowMaps:Bool = false)`

Sirve para Asignar una Propiedad de una Variable, ya sea Propia del Script o Propia del Estado / Sub-Estado en donde se está Ejecutando

Ejemplo: `setProperty('playerIcon.y', 100)`

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

# FlxSprite

## newSprite

Uso: `newSprite(tag:String, ?x:Float, ?y:Float, ?sprite:String)`

Crea una Instancia de FlxSprite

Ejemplo: `newSprite('mySprite', 10, 10, 'menuBG')`

---

## newGradient

Uso: `newGradient(tag:String, width:Int, height:Int, colors:Array<FlxColor>, ?chunkSize:Int = 1, ?rotation:Int = 90, ?interpolate:Bool = true)`

Sirve para Crear FlxSprites que se ve como Gradiente

Ejemplo: `newGradient('myGradient', 1280, 720, {colorFromName('black'), colorFromName('transparent')}, 1, 90, true)`

---

## loadGraphic

Uso: `loadGraphic(tag:String, name:String, ?animated:Bool = false, ?frameWidth:Int = 0, frameHeight:Int = 0)`

Sirve para Cargar una Imágen a un Sprite

Ejemplo: `loadGraphic('mySprite', 'menuBGMagenta')`

---

## getSparrowAtlas

Uso: `getSparrowAtlas(tag:String, path:String)`

Sirve para Cargar un Sprite Animado que Hace uso de XML

Ejemplo: `getSparrowAtlas('mySprite', 'characters/BOYFRIEND')`

---

## makeGraphic

Uso: `makeGraphic(tag:String, width:Int, height:Int, ?color:FlxColor = FlxColor.WHITE)`

Sirve para Crear un Gráfico y Asignárselo a un Sprite

Ejemplo: `makeGraphic('mySprite', 100, 100, colorFromName('blue'))` </br>
<sub>Se Hace Uso de las Funciones de [Color](#color)</sub>

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

## playAnimation

Uso: `playAnimation(tag:String, name:String, ?force:Bool, ?reversed:Bool, ?frame:Int)`

Sirve para Reproducir una Animación que ya fue Añadida al Sprite

Ejemplo: `playAnimation('mySprite', 'epicAnim', true, false)`

## updateHitbox

Uso: `updateHitbox(tag:String)`

Sirve para Actualizar la Hitbox de un Sprite

Ejemplo: `updateHitbox('mySprite')`

---

# FlxText

## newText

Uso: `newText(tag:String, ?x:Float, ?y:Float, ?width:Float, ?text:String, ?size:Int)`

Sirve para Crear una Instancia de FlxText

Ejemplo: `newText('myText', 10, 100, 1280, 'ALE Engine Supremacy', 24)`

---

## applyTextMarkup

Uso: `applyTextMarkup(tag:String, text:String, rules:Array<Array<Dynamic>>)`

Sirve para Asignarle Varios Colores a la Vez a un Texto

Ejemplo: {% raw %}
applyTextMarkup('myText', '*ALE* #Engine# %Supremacy%', {{'*', 0x00FFFF}, {'#', 0xFF0000}, {'%', 0x00FF00}})
{% endraw %}
 </br>
<sub>Se Hace Uso de las Funciones de [Color](#color)</sub>

---

## setTextFormat

Uso: `setTextFormat(tag:String, ?font:String, ?size:Int, ?color:FlxColor, ?alignment:String, ?borderStyle:String, ?borderColor:FlxColor)`

Sirve para Cambiar la Fuente, el Tamaño, el Color, la Alineación, el Estilo del borde y el Color del Borde a un Texto

Ejemplo: `setTextFormat('myText', 'vcr.ttf', 24, colorFromName('white'), 'center', 'shadow', colorFromName('black'))` </br>
<sub>Se Hace Uso de las Funciones de [Color](#color)</sub>

---

# FlxSound

## newSound

Uso: `newSound(tag:String, sound:String)`

Sirve para Crear una Instancia de FlxSound

Ejemplo: `newSound('mySound', 'scrollMenu')`

---

## playSound

Uso: `playSound(tag:String)`

Sirve para Reproducir un Sonido

Ejemplo: `playSound('mySound')`

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