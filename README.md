# MyAnimeLog: An anime tracker powered by the free [Jikan API](https://jikan.moe/).  

## Development XP & takeaways  

+The JIkan API is limited to 1 request per second. This required some creative thinking to limit outgoing requests across the app.  
+Investing the time to design a clean blueprint of the data flow in the app can save a lot of bandwidth.   
+It can be easier to settle on the inevitable compromises between idealism and pragmatism when the end goals are rigid, but the methods flexible.     
+Learned the most cost-efficient ways of pinging the database, and to only request data after all possible local checks have passed.   
+Reducers can be extremely versatile and convenient for complex data structures.  
+It's OK to document potential future problems (at massive scale), but do not overengineer for problems that are unlikely to ever exist. Time is money.  

### Technologies used    

+JS  
+CSS  
+[Firebase](https://firebase.google.com/): Firestore & Authentication   
+[React & bundled libraries](https://reactjs.org/)  
+[React Paginate](https://www.npmjs.com/package/react-paginate)  
+[React Spinners](https://www.davidhu.io/react-spinners/)
+[React Icons](https://react-icons.github.io/react-icons/)  
+[React Loading Skeleton](https://www.npmjs.com/package/react-loading-skeleton)
+[React Responsive](https://www.npmjs.com/package/react-responsive)
+[Styled Components](https://styled-components.com/)    
+Helper libraries: [Lodash](https://lodash.com/ "Lodash") (for debouncing)  
+Deployed with [Vercel](https://vercel.com)
