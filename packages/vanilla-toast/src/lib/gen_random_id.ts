const MAX_ID_LENGTH = 16;
const MIN_ID_LENGTH = 6;
const alpha_numericals = "abcdefghijklmnopqrstuvwxyz0123456789";

/**
 * ## gen_random_id()
 * Synchronously generates a random id using Math.random along a string of alphanumericals using a for loop.
 * If a Math.random() in an if statement is < 0.5, then this turns the current acquired character
 * to uppercase.
 */
export function gen_random_id(length: number = 8) {
    if (length < MIN_ID_LENGTH) {
        throw new Error(
            "Please provide a string length that's greater than " +
                MIN_ID_LENGTH,
        );
    } else if (length > MAX_ID_LENGTH) {
        throw new Error(
            "Please provide a string length that's less than " + MAX_ID_LENGTH,
        );
    }

    let str = "";

    for (let idx = 0; idx < length; ++idx) {
        const random = Math.floor(
            Math.random() * (alpha_numericals.length - 1),
        );

        if (Math.random() < 0.5) {
            str += alpha_numericals[random].toUpperCase();
        } else {
            str += alpha_numericals[random];
        }
    }

    return str;
}
