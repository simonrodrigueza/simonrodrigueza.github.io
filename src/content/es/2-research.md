---
id: research
label: Investigación
title: Investigación
---

<!-- Cada línea "###" es un subtítulo (un tema o proyecto de investigación).
     Agrega un bloque "###" nuevo cuando tengas algo más que mostrar. -->

### Más allá del LTE: Evaluación del HCN y C₂H₂ como trazadores de truncamiento en discos altamente irradiados

*Tesis de pregrado, colaboración XUE (JWST/MIRI). Director: Germán Chaparro. 2025–2026*


La mayoría de las estrellas nacen en cúmulos densos. Allí, estrellas masivas de tipo O y B bañan a sus vecinas con radiación ultravioleta intensa. Esta radiación puede fotoevaporar las regiones externas de los discos protoplanetarios y truncarlos, es decir, reducir su tamaño. Mi tesis se enmarca en la colaboración XUE (eXtreme UV Environments), que estudia con el telescopio espacial James Webb discos en NGC 6357, una de las regiones más extremas de la Vía Láctea. Me centro en XUE 1, un disco expuesto a un campo de radiación cerca de cien mil veces más intenso que el del medio interestelar local.

Trabajos anteriores con modelos termoquímicos propusieron que las moléculas HCN y C₂H₂ son buenos trazadores del truncamiento. Esos modelos asumían equilibrio termodinámico local (LTE), algo difícil de sostener en las regiones externas empobrecidas en gas, que es justo de donde viene esa señal. En esta tesis evalúo si estas moléculas siguen siendo buenos trazadores cuando se deja de asumir LTE. Para ello combino estimaciones analíticas de equilibrio estadístico, modelos del disco con el código ProDiMo en un tratamiento pseudo no-LTE, y transferencia radiativa detallada con FLiTs para generar espectros sintéticos comparables con los de MIRI/JWST.

Los resultados muestran que las capas emisoras se alejan del LTE y que el método de transferencia radiativa cambia la conclusión. Con un estimador simplificado, la emisión de HCN parece casi insensible al truncamiento. Con FLiTs, que incluye la absorción por el polvo en el disco interno, el HCN resulta un trazador muy sensible al tamaño del disco.

### Mapeando condiciones termodinámicas para la estabilidad del agua bajo la superficie de Marte
*Proyecto en equipo con Sebastián Numpaque, Brandon Montoya y David Pérez, con la colaboración del profesor Jorge Zuluaga (Instituto de Física, UdeA). Póster presentado en el Congreso Nacional de Física, Manizales, 2025.*

Las observaciones de radar y los datos sísmicos sugieren que podría existir agua líquida bajo la superficie de Marte. En este proyecto estudiamos en qué lugares del planeta y a qué profundidad la corteza marciana (0–45 km) tendría condiciones de presión y temperatura compatibles con agua líquida.

Partimos de los perfiles de densidad, presión y temperatura obtenidos con el sismómetro SEIS de la misión InSight. Con ellos parametrizamos el perfil de temperatura y resolvimos las ecuaciones de equilibrio hidrostático en Python, tomando como condiciones iniciales los datos de la Mars Climate Database. Así construimos perfiles de presión y temperatura para cada latitud y longitud. Luego los comparamos con el diagrama de fases del agua pura para encontrar la profundidad a la que el hielo pasaría a agua líquida.

El resultado es un mapa global de la profundidad de esta transición, que varía entre 0 y 27 km según la región. El modelo muestra que la estabilidad del agua líquida depende sobre todo de la presión y la temperatura. Las sales, que no incluimos en este modelo inicial, bajarían el punto de congelamiento y acercarían el agua a la superficie. Estos resultados ayudan a evaluar la habitabilidad de Marte y a identificar posibles reservas de agua para futuras misiones. Además, el método se puede aplicar a otros cuerpos planetarios.
