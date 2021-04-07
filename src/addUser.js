const googleSheetUrlToken = "xyz"; // ID arkusza kalkulacyjnego (wyciągnięta z jego URL)
const sheetName = "doNowychKont"; //nazwa karty arkusza

function addUser() {
  let ss = SpreadsheetApp.openById(googleSheetUrlToken);
  const sheet = ss.getSheetByName(sheetName);
  let newUsersSheetData = sheet.getDataRange().getValues().slice(1); // dane z danego arkusza bez nagłówka

  const newUsersPerGroup = generateNewEmailsDict(fixedGroupOwners);

  for (let i = 0; i < newUsersSheetData.length; i++) {
    // dla każdego wiersza z odczytywanego arkusza
    const {
      name,
      lastName,
      recoveryEmail,
      recoveryPhone,
      userDomainEmail,
      newPassword,
    } = extractUserDetails(newUsersSheetData[i]);
    const newUser = getUserObject(
      userDomainEmail,
      name,
      lastName,
      recoveryEmail,
      recoveryPhone,
      newPassword
    );

    try {
      // wybranie adresu email grupy na podstawie wyboru użykownika
      const usersGroupEmail =
        matchChoosenTargetGroupToGroupEmail[newUsersSheetData[i][6]];
      try {
        // tutaj będziemy poproszeni o pozwolenie na korzystanie z Admin API -> klikamy tak
        const addedUser = AdminDirectory.Users.insert(newUser);
      } catch (e) {
        Logger.log(
          "Użytkownik o takim adresie email prawdopodobnie już istnieje"
        );
        Logger.log(e);
      }
      const groupMember = getMemberOfGroupDetails(newUser.primaryEmail);

      try {
        const member = AdminDirectory.Members.insert(
          groupMember,
          usersGroupEmail
        );
      } catch (e) {
        Logger.log(e);
      }

      const messageForUser =
        getWelcomeMessage(
          name,
          newUser.primaryEmail,
          newPassword,
          usersGroupEmail
        ) + itGroupEmailFooter;
      // dodanie użytkownika do listy stworzonych członków dla konkretnej grupy google
      newUsersPerGroup[usersGroupEmail].push(
        `${recoveryEmail} | ${newUser.primaryEmail}`
      );
      // kolejne pozwolenie
      GmailApp.sendEmail(recoveryEmail, NEW_USER_WELCOME_MESSAGE_SUBJECT, "", {
        bcc: "",
        htmlBody: messageForUser,
        from: "it@psrp.org.pl",
      });
    } catch (e) {
      Logger.log(e);
    }
  }
  // dla każdego maila komisyjnego wyślij podsumowanie na adres jej właściciela
  for (const [key, value] of Object.entries(newUsersPerGroup)) {
    if (value.length !== 0) {
      const ownerMessage =
        getReminderForGroupOwner(key, value) + itGroupEmailFooter;
      GmailApp.sendEmail(
        fixedGroupOwners[key],
        NOTIFY_OWNER_MESSAGE_SUBJECT,
        "",
        { bcc: "", htmlBody: ownerMessage, from: "it@psrp.org.pl" }
      );
    }
  }
}
