// wygenerowanie treści wiadomości powitalnej dla użytkownika - wysłana na jego mail zapasowy
const getWelcomeMessage = (
  newUsersName,
  newEmail,
  newUsersPassword,
  groupMail
) => `
  <div style="color: #3c4043; background-color: #fffffe; font-family: 'Roboto Mono', Menlo, Monaco, 'Courier New', monospace; font-weight: 400; font-size: 13px; line-height: 20px; white-space: pre;">
  <div>Cześć ${newUsersName}!</div>
  <br />
  <div>Zostało utworzone dla Ciebie konto w domenie @psrp.</div>
  <br />
  <div>Dane potrzebne do zalogowania:</div>
  <div>1) e-mail: ${newEmail}</div>
  <div>2) hasło: ${newUsersPassword}</div>
  <div>3) link: https://accounts.google.com/signin/v2/identifier?hl=PL&amp;flowName=GlifWebSignIn&amp;flowEntry=ServiceLogin</div>
  <br />
  <div>W ciągu 48h zaloguj się na nie i koniecznie zmień jego hasło! Po zalogowaniu otrzymasz o to prośbę.</div>
  <div>&nbsp;</div>
  <div>Ogłaszamy, że zostałeś dodany do grupy wybranej w formularzu zgłoszeniowym. Jej adres to: ${groupMail}.</div>
  <br />
  <div>W razie jakichkolwiek problem&oacute;w proszę kontaktować się&nbsp;z it@psrp.org.pl.</div>
  </div>
  `;

const getOrderedNewUsersList = (newUsers) => {
  let newList = ["<p>&nbsp;</p>"];
  newList.push(`<ol>`);
  newUsers.forEach((email) => {
    newList.push(`<li>${email}</li>`);
  });
  newList.push(["</ol>"]);
  newList.push("<p>&nbsp;</p>");
  return newList.join("\n");
};

// wygenerowanie treści wiadomości email dla właścicieli grup
const getReminderForGroupOwner = (groupMail, newUsers) => `
  <div style="color: #3c4043; background-color: #fffffe; font-family: 'Roboto Mono', Menlo, Monaco, 'Courier New', monospace; font-weight: 400; font-size: 13px; line-height: 20px; white-space: pre;">
  <div>Cześć!</div>
  <div>&nbsp;</div>
  <div>Na wniosek złożony w formularzu rejestracyjnym kont psrp, do Twojej grupy ${groupMail} została dodana nowa osoba/y: ${getOrderedNewUsersList(
  newUsers
)}</div>
  <div>&nbsp;</div>
  <div>Przypomnij jej, aby sprawdziła maila wyznaczonego w formularzu jako zapasowy.</div>
  <div>&nbsp;</div>
  <div>Pozdrowienia z piwnicy!</div>
  <div>&nbsp;</div>
  <div>&nbsp;</div>
  </div>
  `;

const itGroupEmailFooter = `
  <div>KOD HTML STOPKI NADAWCY</div>
  `;
// funckja zwracająca adres e-mail grupy na podstawie opcji zaznaczonej w formularzu rejestracyjnym.
// Gdy nie znajdzie odpowiednika z formularza, zwróci undefined i popsuje przebieg skrypu
const matchChoosenTargetGroupToGroupEmail = {
  "komisja ds. rozwoju i cyfryzacji": "rozwoj@psrp.org.pl",
};

// funckja zwracająca adres e-mail właściciela grupy - kto ma zostać powiadomionym o otwarciu nowego konta w grupie
const fixedGroupOwners = {
  "rozwoj@psrp.org.pl": "m.majchrowski@psrp.org.pl",
};

// funkcja zwracająca obiekt do agregowania nowych kont użytkownika, aby grupowo wysłać użytkowników do właściciela grupy
const generateNewEmailsDict = (groupOwners) => {
  const groupEmails = {};

  Object.keys(groupOwners).forEach((groupEmail) => {
    groupEmails[groupEmail] = [];
  });

  return groupEmails;
};

const polishSignsMapper = {
  ą: "a",
  ę: "e",
  ó: "o",
  ś: "s",
  ł: "l",
  ż: "z",
  ź: "z",
  ć: "c",
  ń: "n",
};

// usunięcie z adresu email z domeny psrp polskich znaków oraz spacji
const removePolishSigns = (email) => {
  let preparedEmail = email;
  preparedEmail = preparedEmail.replace(" ", "");
  preparedEmail = preparedEmail.replace(/[^A-Za-z0-9\[\] ]/g, (letter) => {
    return polishSignsMapper[letter] || letter;
  });
  return preparedEmail;
};

const getUserObject = (
  userDomainEmail,
  name,
  lastName,
  usersRecoveryEmail,
  usersRecoveryPhone,
  newPassword
) => {
  return {
    primaryEmail: userDomainEmail,
    name: {
      givenName: name,
      familyName: lastName,
    },
    recoveryEmail: usersRecoveryEmail,
    recoveryPhone: usersRecoveryPhone,
    password: newPassword,
    orgUnitPath: "/",
    changePasswordAtNextLogin: true,
  };
};

// wyciągniecie z wiersza arkusza informacji o użytkowniku
const extractUserDetails = (dataRow) => {
  return {
    name: dataRow[0],
    lastName: dataRow[1],
    recoveryEmail: dataRow[2],
    recoveryPhone: dataRow[4],
    userDomainEmail: removePolishSigns(dataRow[3]),
    newPassword: Math.random().toString(36),
  };
};

// opcje wymagane przy dodawaniu użytkownika do grupy google'owskiej
const getMemberOfGroupDetails = (newUserEmail) => {
  return {
    email: newUserEmail,
    role: "MEMBER", // uprawnienia członka
  };
};
