import { useEffect, useRef, useState } from "react";

const Field = ({element}) => {

    let [animals, setAnimals] = useState([])
    const [boundary, setBoundary] = useState({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    });
    const [waterBoundary, setWaterBoundary] = useState([])
    const [stepSize, setStepSize] = useState({
        vertical: 30,
        horizontal: 50
    })

    let direction = ["top", "bottom", "left", "right"];
    const worldRef = useRef(null);

    const pickDirection = () => {
        const randInt = Math.floor(Math.random() * 4);
        return direction[randInt];
    }

    const checkForWater = (animalTop, animalLeft, water) => {
        // let animalTop = Number(animal.style.top.substring(0, animal.style.top.length - 2));
        // let animalLeft = Number(animal.style.left.substring(0, animal.style.left.length - 2));

        let waterTop = Number(water.style.top.substring(0, water.style.top.length - 2));
        let waterLeft = Number(water.style.left.substring(0, water.style.left.length - 2));

        let distanceX = Math.abs(animalLeft - waterLeft);
        let distanceY = Math.abs(animalTop - waterTop);

        if(distanceX > 65.5) return false; // water width / 2 + animal radius
        if(distanceY > 65.5) return false;

        if(distanceX <= 50) return true;
        if(distanceY <= 50) return true;

        let cornerDistance = Math.pow((distanceX - 50), 2) + Math.pow((distanceY - 50), 2);

        return cornerDistance <= Math.pow(12.5, 2);
    }

    const checkForRabbit = (animal) => {
        let rabbitsArray = [];
        let rabbitsDistances = [];
        let result = []
        animals.forEach(rabbit => {
                            
            if(rabbit.className === "rabbit"){
                let strFT = Number(animal.style.top.substring(0, animal.style.top.length - 2));
                let strFL = Number(animal.style.left.substring(0, animal.style.left.length - 2));

                let strRT = Number(rabbit.style.top.substring(0, rabbit.style.top.length - 2));
                let strRL = Number(rabbit.style.left.substring(0, rabbit.style.left.length - 2));

                rabbitsDistances.push(Number(Math.sqrt(Math.pow((strFL-strRL), 2) + Math.pow((strFT-strRT), 2))));
                rabbitsArray.push(rabbit);

                if(Number(Math.sqrt(Math.pow((strFL-strRL), 2) + Math.pow((strFT-strRT), 2))) <= 200){
                    console.log("Fox sees Rabbit");
                    if (Math.pow((strFL-strRL), 2) > Math.pow((strFT-strRT), 2)) {
                        var temp = (strFL >= strRL) ? "left" : "right";
                        result.push(temp);
                    } else {
                        var temp = (strFT >= strRT) ? "top" : "bottom";
                        result.push(temp);
                    }
                    
                } else {
                    result.push(pickDirection());
                }
            }
        })
        let min = Math.min(...rabbitsDistances);
        let minIndex = rabbitsDistances.indexOf(min);

        if (result.length === 0){
            return pickDirection();
        }
        return (result[minIndex]);
    }

    const deleteItem = (id) => {
        let newArray = animals.filter(item => {
                return item.attributes.id.nodeValue !== id 
            })
        animals = newArray
    }

    useEffect(() => { 
        const world = document.getElementsByClassName("world2")[0];   
        setBoundary({
            top: Number(world.offsetTop) + stepSize.vertical,
            bottom: Number(world.offsetHeight) + Number(world.offsetTop) - stepSize.vertical,
            left: Number(world.offsetLeft) + stepSize.horizontal,
            right: Number(world.offsetWidth) + Number(world.offsetLeft) - stepSize.horizontal
        });

        if(element === "Start"){
            console.log("Start Game");
            console.log(animals);
            animals.forEach(animal => {
                setInterval(()=>{
                    let strT = animal.style.top.substring(0, animal.style.top.length - 2);
                    let strB = animal.style.top.substring(0, animal.style.top.length - 2);
                    let strL = animal.style.left.substring(0, animal.style.left.length - 2);
                    let strR = animal.style.left.substring(0, animal.style.left.length - 2);

                    let newPositionTop = Number(Number(strT) - stepSize.vertical);
                    let newPositionBottom = Number(Number(strB) + stepSize.vertical);
                    let newPositionLeft = Number(Number(strL) - stepSize.horizontal);
                    let newPositionRight = Number(Number(strR) + stepSize.horizontal);
                    
                    let dir = "";
                    
                    if (animal.className === "fox"){
                        dir = checkForRabbit(animal);
                    } else {
                        dir = pickDirection();
                    }

                    switch (dir) {
                        case "top":
                            if(newPositionTop >= boundary.top){
                                var overlap = false;
                                waterBoundary.forEach(water => {
                                    if(!overlap){
                                        overlap = checkForWater(newPositionTop, strL, water);
                                    }
                                    if(overlap) console.log("Crossing Water");
                                })
                                if(!overlap){
                                    animal.style.top = newPositionTop + "px";
                                    animal.style.rotate = "270deg";
                                }
                            } else {
                                var overlap = false;
                                waterBoundary.forEach(water => {
                                    if(!overlap){
                                        overlap = checkForWater(newPositionBottom, strL, water);
                                    }
                                    if(overlap) console.log("Crossing Water");
                                })
                                if(!overlap){
                                    animal.style.top = newPositionBottom + "px";
                                    animal.style.rotate = "90deg";
                                }
                            }
                            break;
                        case "bottom":
                            if(newPositionBottom <= boundary.bottom){
                                var overlap = false;
                                waterBoundary.forEach(water => {
                                    if(!overlap){
                                        overlap = checkForWater(newPositionBottom, strL, water);
                                    }
                                    if(overlap) console.log("Crossing Water");
                                })
                                if(!overlap){
                                    animal.style.top = newPositionBottom + "px";
                                    animal.style.rotate = "90deg";
                                }
                            } else {
                                var overlap = false;
                                waterBoundary.forEach(water => {
                                    if(!overlap){
                                        overlap = checkForWater(newPositionTop, strL, water);
                                    }
                                    if(overlap) console.log("Crossing Water");
                                })
                                if(!overlap){
                                    animal.style.top = newPositionTop + "px";
                                    animal.style.rotate = "270deg";
                                }
                            }
                            break;
                        case "left":
                            if(newPositionLeft >= boundary.left){
                                var overlap = false;
                                waterBoundary.forEach(water => {
                                    if(!overlap){
                                        overlap = checkForWater(strT, newPositionLeft, water);
                                    }
                                    if(overlap) console.log("Crossing Water");
                                })
                                if(!overlap){
                                    animal.style.left = newPositionLeft + "px";
                                    animal.style.rotate = "180deg";
                                }
                            } else {
                                var overlap = false;
                                waterBoundary.forEach(water => {
                                    if(!overlap){
                                        overlap = checkForWater(strT, newPositionRight, water);
                                    }
                                    if(overlap) console.log("Crossing Water");
                                })
                                if(!overlap){
                                    animal.style.left = newPositionRight + "px";
                                    animal.style.rotate = "0deg";
                                }
                            }
                            break;
                        case "right":
                            if(newPositionRight <= boundary.right){
                                var overlap = false;
                                waterBoundary.forEach(water => {
                                    if(!overlap){
                                        overlap = checkForWater(strT, newPositionRight, water);
                                    }
                                    if(overlap) console.log("Crossing Water");
                                })
                                if(!overlap){
                                    animal.style.left = newPositionRight + "px";
                                    animal.style.rotate = "0deg";
                                }
                            } else {
                                var overlap = false;
                                waterBoundary.forEach(water => {
                                    if(!overlap){
                                        overlap = checkForWater(strT, newPositionLeft, water);
                                    }
                                    
                                    if(overlap){
                                        console.log("Crossing Water");
                                    }
                                })
                                if(!overlap){
                                    animal.style.left = newPositionLeft + "px";
                                    animal.style.rotate = "180deg";
                                }
                            }
                            break;
                        default:
                            console.log("Something went wrong!");
                            break;
                    }

                    if(animal.className === "fox"){
                        animals.forEach(rabbit => {
                            if(rabbit.className === "rabbit"){
                                let strFT = Number(animal.style.top.substring(0, animal.style.top.length - 2));
                                let strFL = Number(animal.style.left.substring(0, animal.style.left.length - 2));

                                let strRT = Number(rabbit.style.top.substring(0, rabbit.style.top.length - 2));
                                let strRL = Number(rabbit.style.left.substring(0, rabbit.style.left.length - 2));
                                
                                switch (dir){
                                    case "top":
                                        if (strRT >= strFT - 100 &&
                                            strRT <= strFT &&
                                            strRL <= strFL + 50 &&
                                            strRL >= strFL - 50) {
                                                console.log("Remove");
                                                
                                                deleteItem(rabbit.attributes.id.nodeValue);
                                                rabbit.remove();
                                            }
                                        break;
                                    case "bottom":
                                        if (strRT >= strFT &&
                                            strRT <= strFT + 100 &&
                                            strRL <= strFL + 50 &&
                                            strRL >= strFL - 50) {
                                                console.log("Remove");
                                                
                                                rabbit.remove();
                                                deleteItem(rabbit.attributes.id.nodeValue);
                                            }
                                        break;
                                    case "left":
                                        if (strRT >= strFT - 50 &&
                                            strRT <= strFT + 50 &&
                                            strRL <= strFL &&
                                            strRL >= strFL - 100) {
                                                console.log("Remove");
                                                
                                                rabbit.remove();
                                                deleteItem(rabbit.attributes.id.nodeValue);
                                            }
                                        break;
                                    case "right":
                                        if (strRT >= strFT - 50 &&
                                            strRT <= strFT + 50 &&
                                            strRL >= strFL &&
                                            strRL <= strFL + 100) {
                                                console.log("Remove");
                                                
                                                rabbit.remove();
                                                deleteItem(rabbit.attributes.id.nodeValue);
                                            }
                                        break;
                                    default:
                                        console.log("Something went wrong!");
                                        break;
                                }
                            }
                        })
                    }
                }, 1000)
            })
            
        }
        
    }, [element])

    const addElement = (e) => {
        if(e.target.className !== "world2"){
            return;
        }

        let div = document.createElement('div');
        div.style.position = "absolute";
        div.style.height = "25px";
        div.style.width = "25px";
        div.style.top = Number(e.clientY - 12.5) + "px";
        div.style.left = Number(e.clientX - 12.5) + "px";
        div.style.transition = "1s";
        div.style.zIndex = "1"

        switch (element){
            case "Fox":
                div.className = 'fox';

                let range = document.createElement('div');
                
                range.style.position = "relative";
                range.style.height = "100px";
                range.style.width = "100px";
                range.style.backgroundColor = "red";
                range.style.opacity = "0.5";
                range.style.borderRadius = "50%";
                range.style.top = "-36.25px"

                div.appendChild(range);
                div.id = animals.length;

                setAnimals(prevState => [...prevState, div]);
                break;
            case "Rabbit":
                div.className = 'rabbit';
                div.id = animals.length;

                setAnimals(prevState => [...prevState, div]);
                break;
            case "Water":
                div.style.height = "100px";
                div.style.width = "100px";
                div.style.top = Number(e.clientY - 50) + "px";
                div.style.left = Number(e.clientX - 50) + "px";
                div.style.borderRadius = "25px"

                div.className = 'water';
                setWaterBoundary(prevState => [...prevState, div]);
                break;
            default:
                return;
        }
        
        e.target.appendChild(div);

    }

    return (
        <div className="world2" onClick={addElement} ref={worldRef}>
            
        </div>
    )
}
export default Field;