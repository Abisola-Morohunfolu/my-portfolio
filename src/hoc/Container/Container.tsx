import  {ReactNode} from "react";

interface ContainerProps {
    children: ReactNode;
}


const Container = (props: ContainerProps) => <div>{props.children}</div>;

export default Container;
