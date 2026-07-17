async function getMembers() {

    // Vai buscar o arquivo
    const response = await fetch("data/members.json");

    // Converte o JSON em objeto JavaScript
    const members = await response.json();

    // Mostra os dados no console
    console.log(members);
}

getMembers();