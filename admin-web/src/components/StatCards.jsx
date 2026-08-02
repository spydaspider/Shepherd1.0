import styles from "./StatCards.module.css";



const StatCards = ({dashboard})=>{


const cards=[

{
title:"Total Members",
value:
dashboard.members.totalMembers
},

{
title:"Adults",
value:
dashboard.members.adults
},


{
title:"Children",
value:
dashboard.members.children
},


{
title:"Attendance Rate",
value:
`${dashboard.attendance.rate}%`
},


{
title:"Present Today",
value:
dashboard.attendance.present
},


{
title:"Follow Ups",
value:
dashboard.followUps.pending
}


];





return (

<div className={styles.cards}>


{

cards.map((card,index)=>(


<div
className={styles.card}
key={index}
>


<h3>
{card.title}
</h3>


<h1>
{card.value}
</h1>


</div>


))


}


</div>


);


};


export default StatCards;