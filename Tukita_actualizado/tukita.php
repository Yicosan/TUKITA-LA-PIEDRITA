<?php
/* ================================
   VARIABLES TIPO STRING
================================ */
$nombre = "Tukita";
$tipo = "Criaturita virtual tipo musguito";
$personalidad = "Tierna, curiosa, juguetona y un poco dramática cuando no la cuidan.";
$le_gusta = "comer manzanitas, jugar videojuegos, dormir y estar limpia.";
$no_le_gusta = "tener hambre, estar sucia, enfermarse o quedarse sin energía.";

/* ================================
   VARIABLES TIPO INT
================================ */
$edad = 1;
$hambre = 50;
$energia = 70;
$felicidad = 75;
$salud = 85;
$higiene = 80;
$pelo = 75;

/* ================================
   VARIABLES TIPO BOOL
================================ */
$estaDormida = false;

/* ================================
   VARIABLES TIPO LISTA / ARRAY
================================ */
$estados_de_animo = ["feliz", "triste", "cansada", "enojada", "enferma"];
$comportamientos = ["comer", "dormir", "jugar", "bañar", "curar", "cortar pelo"];
$objetos = ["manzana", "luna", "mando", "jabón", "poción curativa", "tijeritas"];

/* ================================
   MOSTRAR INFORMACIÓN
================================ */
echo "<h1>Información de Tukita</h1>";
echo "<p><strong>Nombre:</strong> " . $nombre . "</p>";
echo "<p><strong>Tipo:</strong> " . $tipo . "</p>";
echo "<p><strong>Edad:</strong> " . $edad . " año</p>";
echo "<p><strong>Personalidad:</strong> " . $personalidad . "</p>";
echo "<p><strong>Le gusta:</strong> " . $le_gusta . "</p>";
echo "<p><strong>No le gusta:</strong> " . $no_le_gusta . "</p>";

echo "<h2>Estado inicial</h2>";
echo "<p>Hambre: " . $hambre . "%</p>";
echo "<p>Energía: " . $energia . "%</p>";
echo "<p>Felicidad: " . $felicidad . "%</p>";
echo "<p>Salud: " . $salud . "%</p>";
echo "<p>Higiene: " . $higiene . "%</p>";
echo "<p>Pelo: " . $pelo . "%</p>";
echo "<p>¿Está dormida?: " . ($estaDormida ? "Sí" : "No") . "</p>";

echo "<h2>Estados de ánimo</h2>";
echo "<ul>";
foreach ($estados_de_animo as $estado) {
    echo "<li>" . $estado . "</li>";
}
echo "</ul>";

echo "<h2>Comportamientos</h2>";
echo "<ul>";
foreach ($comportamientos as $comportamiento) {
    echo "<li>" . $comportamiento . "</li>";
}
echo "</ul>";
?>
