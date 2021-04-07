const NEW_USER_WELCOME_MESSAGE_SUBJECT = "Witamy w PSRP!";
const NOTIFY_OWNER_MESSAGE_SUBJECT = "Nowi członkowie Twojej komisji!";

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
<div dir="auto">
  <div dir="auto"><div dir="auto"><div dir="auto">Ze studenckimi pozdrowieniami od IT<br><table border="0" cellpadding="0" cellspacing="0" align="left" style="font-family: sans-serif; font-size: 12.8px; width: 340pt; margin-left: 4.05pt; margin-right: 4.05pt; color: rgb(226, 226, 226) !important;"><tbody><tr><td valign="top" width="78" style="width: 78.3pt; border-style: none solid none none; border-right-width: 1pt; border-right-color: rgb(1, 61, 137); padding: 0.75pt 6pt 0.75pt 0.75pt; height: 40.3pt;"><img src="http://psrp.webd.pl/.sharedphotos/logopsrp.png" width="105" height="105" style="padding-left: 10px; padding-top: 10px; padding-right: 5px;"></td><td valign="top" width="231" style="width: 230.7pt; padding: 0.75pt 0.75pt 0.75pt 4.5pt; height: 40.55pt;"><p><strong><span style="font-size: 10pt; font-family: arial; color: rgb(162, 162, 162) !important;">Komisja ds. rozwoju i cyfryzacji</span></strong><span style="font-size: 9.5pt; font-family: arial;"><br></span><span style="font-size: 9pt; font-family: arial; color: rgb(170, 190, 255) !important;">Parlamentu Studentów Rzeczypospolitej Polskiej</span><span style="font-size: 9.5pt; font-family: arial;"><br></span><span style="font-size: 8.5pt; font-family: helvetica; border: 1pt none windowtext; padding: 0cm; color: rgb(170, 190, 255) !important;">| ul. Bracka 18/16, 00-028 Warszawa</span><span style="font-size: 8.5pt; font-family: arial; color: rgb(170, 190, 255) !important;">&nbsp;<br></span><span style="font-size: 8.5pt; font-family: helvetica; color: rgb(170, 190, 255) !important;">|&nbsp;tel. kom<span style="border: 1pt none windowtext; padding: 0cm;">:</span>&nbsp;</span><span style="font-size: 8.5pt; font-family: arial; color: rgb(170, 190, 255) !important;"><a title="Call me!" href="tel:+48505245738" target="_blank" rel="noopener" data-toggle="tooltip">505 245 738</a><br></span><span style="font-size: 8.5pt; font-family: helvetica; border: 1pt none windowtext; padding: 0cm; color: rgb(170, 190, 255) !important;">|&nbsp;e-mail:&nbsp;<a title="mailto:m.majchrowski@psrp.org.pl" href="mailto:m.majchrowski@psrp.org.pl" data-toggle="tooltip" style="color: rgb(177, 133, 246) !important; display: inline;">m.majchrowski@psrp.org.pl</a>&nbsp;<br>|&nbsp;www:&nbsp;<a href="http://www.psrp.org.pl/" style="color: rgb(177, 133, 246) !important;">www.psrp.org.pl</a></span></p></td></tr></tbody></table></div></div><div dir="auto"><br></div><div dir="auto"><br></div><div dir="auto"><br></div><div dir="auto"><br></div><div dir="auto"><br></div><div dir="auto"><br></div><div dir="auto"><br></div><div dir="auto"><br></div></div></div>
`;

const matchChoosenTargetGroupToGroupEmail = {
  "komisja ds. prawno-socjalnych": "prawo@psrp.org.pl",
  "komisja ds. projektów": "projekty@psrp.org.pl",
  "komisja ds. współpracy zewnętrznej": "wspolpraca@psrp.org.pl",
  "komisja ds. jakości kształcenia i umiędzynarodowienia":
    "dydaktyka@psrp.org.pl",
  "komisja ds. rozwoju i cyfryzacji": "rozwoj@psrp.org.pl",
  "komisja ds. ewaluacji": "ewaluacja@psrp.org.pl",
  "komisja ds. strategii": "strategia@psrp.org.pl",
  "centrum komunikacji": "pr@psrp.org.pl",
  kum: "kum@psrp.org.pl",
  KWSM: "kwsm@kwsm.psrp.org.pl",
};

const fixedGroupOwners = {
  "prawo@psrp.org.pl": "p.robak@psrp.org.pl",
  "projekty@psrp.org.pl": "j.banasiak@psrp.org.pl",
  "wspolpraca@psrp.org.pl": "a.peplowska@psrp.org.pl",
  "dydaktyka@psrp.org.pl": "j.maruszczak@psrp.org.pl",
  "rozwoj@psrp.org.pl": "m.majchrowski@psrp.org.pl",
  "ewaluacja@psrp.org.pl": "a.malicki@psrp.org.pl",
  "strategia@psrp.org.pl": "d.rychlik@psrp.org.pl",
  "pr@psrp.org.pl": "centrum.komunikacji@psrp.org.pl",
  "kum@psrp.org.pl": "s.kuropatwinska@psrp.org.pl",
  "kwsm@kwsm.psrp.org.pl": "p.petryla@kwsm.psrp.org.pl",
};

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

const getMemberOfGroupDetails = (newUserEmail) => {
  return {
    email: newUserEmail,
    role: "MEMBER",
  };
};
