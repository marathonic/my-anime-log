// °°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°FOUND IT!!!  WHEN WE'VE JUST SPLIT THE LOG FOR ALPHABET REORDER, WE HAVE 12 ENTRIES AT THAT MOMENT!!!°°°°°°
// AND THEN ON THE NEXT FETCH WE HAVE 17 ENTRIES IN THE LOG.

///READ ABOVE!!! paste above on line 440 in UsersAnimeLog
// EDIT: READ BELOW:

// *************WE CANNOT RELY ON <fetchedUserLogs[`${userListSelector}`]?.length % 5 === 0> ANYMORE.************
// WHY???
// BECAUSE, When re order alphabetically, we cut the log at an arbitrary length.

// Example:
// If we had loaded 20 entries and our new entry substitutes Entry # 18, the log cuts at #18.
// ON that component update, our log length is 18.
// 18 is not divisible by 5. What if it cut at 20 instead? That's divisible. See how it doesn't matter?
// What does it matter if it cuts at 7, or 11, or 44, or 34, or 99?
// NO MATTER WHAT # NEW ENTRY CUTS AT, when we finish loading the whole log, log length will probably not be divisible by 5.

// -------------------
// First render of category: automatically fetch 10 results.
// On button press ('load more'), run a similar function, but with stateful scrolledCategory.

const getUsersCategoryLog = async (categ) => {
  const q = query(
    collection(db, "theNewUsers", user?.uid, "animeLog"),
    where("status", "==", categ)
  );
  const querySnapshot = await getDocs(q);
  let arr = [];
  querySnapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
    arr.push({ ...doc.data() });
  });
  // updateFetchedUserLogs({ [`${categ}`]:
  // {...scrolledCategory},
  // arr });
  updateScrolledCategory({ [`${categ}`]: (oldArray) => [...oldArray, arr] });
  return;
};
