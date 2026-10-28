import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDescription, withoutEmoji } from "../src/utils/description.ts";

test("formats the current database description without duplicating text or keeping emoji", () => {
  const description = `¡PARTICIPA POR 2 IPHONES Y 10 PREMIOS DE $500.000! 🎉

Con Doblaje Quillero tienes la oportunidad de ganar increíbles premios comprando tus stickers digitales, cada uno con un número único de participación.

Cada número cuesta $2.500 COP.

Compra mínima: 6 números por solo $15.000.

¿CUÁNDO ES EL SORTEO? 🎰

El sorteo se realizará con la Lotería de Medellín cuando se venda el 100 % de los 10.000 números disponibles.

📢 Yo mismo anunciaré con anticipación la fecha oficial del sorteo en mis redes sociales y en esta página.

¡ATENCIÓN A LOS NÚMEROS VERDES! 🟢

Si al recibir tus números por correo electrónico alguno aparece marcado en VERDE, significa que ese número ha sido premiado con $500.000.

¡Revisa bien todos tus números cuando te lleguen al correo!`;
  const result = formatDescription(description, "Nombre de campaña");
  assert.equal(result.title, "¡PARTICIPA POR 2 IPHONES Y 10 PREMIOS DE $500.000!");
  assert.equal(result.sections.length, 3);
  assert.equal(result.sections[0].paragraphs.length, 3);
  assert.equal(result.sections[1].heading, "¿CUÁNDO ES EL SORTEO?");
  assert.equal(result.sections[1].paragraphs.length, 2);
  assert.equal(result.sections[2].heading, "¡ATENCIÓN A LOS NÚMEROS VERDES!");
  const renderedLines = [result.title, ...result.sections.flatMap(({ heading, paragraphs }) => [heading, ...paragraphs])].filter(Boolean);
  assert.deepEqual(renderedLines, description.split("\n").map(withoutEmoji).filter(Boolean));
  assert.doesNotMatch(renderedLines.join(" "), /\p{Extended_Pictographic}/u);
});

test("changes the title and content when the database description changes", () => {
  const result = formatDescription("NUEVA CAMPAÑA\nPrecio actualizado: $3.000.\n¿Nueva fecha?\nAnuncio actualizado.", "Nombre");
  assert.equal(result.title, "NUEVA CAMPAÑA");
  assert.deepEqual(result.sections, [
    { heading: "", paragraphs: ["Precio actualizado: $3.000."] },
    { heading: "¿Nueva fecha?", paragraphs: ["Anuncio actualizado."] },
  ]);
});

test("uses campaign name for plain text and preserves numbers, accents and punctuation", () => {
  assert.deepEqual(formatDescription("Descripción con 10 premios de $500.000.\r\nMínimo: 6.", "Campaña"), {
    title: "Campaña",
    sections: [{ heading: "", paragraphs: ["Descripción con 10 premios de $500.000.", "Mínimo: 6."] }],
  });
});

test("handles empty descriptions and removes emoji sequences without changing numbers", () => {
  assert.deepEqual(formatDescription(" \n🎉\n", "Mi campaña"), { title: "Mi campaña", sections: [] });
  assert.equal(withoutEmoji("🟢 Premio 👩🏽‍💻 10 números 🎟️"), "Premio 10 números");
});

test("keeps literal HTML as text for React to escape, without interpreting it", () => {
  assert.equal(formatDescription("<script>alert('x')</script>", "Campaña").sections[0].paragraphs[0], "<script>alert('x')</script>");
});
