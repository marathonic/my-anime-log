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
