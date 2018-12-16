 import styled from 'styled-components';


 const calculateColor = (level) => {
    if (level < 20) {
        return '#1af21a';
    } else if (level < 40) {
        return '#1af21a';
    } else if (level < 60) {
        return '#1af21a';
    } else if (level < 80) {
        return '#1af21a';
    } else {
       return '#bb0707'; 
    }
}
const RpmStyles = styled.div`
  width: 100%;
  --color: ${props => calculateColor(props.level)};
  border: 2px solid black;
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  flex-direction: column-reverse;
  background: #c5c5c5;
  .level {
    transition: all 0.1s;
    height: ${props => props.level}%;
    text-align: center;
    color: white;
    display: block;
    background: var(--color);
  }
`;


const Rpm = props => {
    const level = Math.ceil(props.actual * 100 / (props.max - props.min));
    return (
        <RpmStyles level={level}>
            <span className="level">{level}</span>
        </RpmStyles>
    );
}
    ;

Rpm.defaultProps = {
    max: 0,
    min: 0,
    actual: 0,
};

export default Rpm;