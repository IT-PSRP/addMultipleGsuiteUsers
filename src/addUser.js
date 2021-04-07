const googleSheetUrlToken = "xyz"; // ID arkusza kalkulacyjnego (wyciągnięta z jego URL)
const sheetName = "doNowychKont"; //nazwa karty arkusza

function addUser() {
  let ss = SpreadsheetApp.openById(googleSheetUrlToken);
  const sheet = ss.getSheetByName("sheetName");
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
      const usersGroupEmail =
        matchChoosenTargetGroupToGroupEmail[newUsersSheetData[i][6]];
      try {
        // const addedUser = AdminDirectory.Users.insert(newUser);
        Logger.info(`nowy użytkownik: ${JSON.stringify(newUser)}`);
      } catch (e) {
        Logger.log(
          "Użytkownik o takim adresie email prawdopodobnie już istnieje"
        );
        Logger.log(e);
      }
      Logger.log(newUser.primaryEmail);
      const groupMember = getMemberOfGroupDetails(newUser.primaryEmail);

      try {
        // const member = AdminDirectory.Members.insert(groupMember, usersGroupEmail);
        Logger.info(`nowy użytkownik: ${JSON.stringify(groupMember)}`);
        Logger.info(`nowa grupa: ${usersGroupEmail}`);
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

      newUsersPerGroup[usersGroupEmail].push(
        `${recoveryEmail} | ${newUser.primaryEmail}`
      );
      // GmailApp.sendEmail(recoveryEmail, NEW_USER_WELCOME_MESSAGE_SUBJECT, '', {bcc: "", htmlBody: messageForUser, from: "it@psrp.org.pl"})
      Logger.info({
        recoveryEmail,
        NEW_USER_WELCOME_MESSAGE_SUBJECT,
        messageForUser,
      });
    } catch (e) {
      Logger.log(e);
    }
  }
  // Logger.log(newUsersPerGroup)
  for (const [key, value] of Object.entries(newUsersPerGroup)) {
    if (value.length !== 0) {
      const ownerMessage =
        getReminderForGroupOwner(key, value) + itGroupEmailFooter;
      // GmailApp.sendEmail(fixedGroupOwners[key], NOTIFY_OWNER_MESSAGE_SUBJECT, '', {bcc: "", htmlBody: ownerMessage, from: "it@psrp.org.pl"})
      const lolz = fixedGroupOwners[key];
      Logger.info({ lolz, NOTIFY_OWNER_MESSAGE_SUBJECT, ownerMessage });
    }
  }
}
