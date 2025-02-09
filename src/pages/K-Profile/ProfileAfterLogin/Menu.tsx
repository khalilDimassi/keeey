import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const Menu = () => {

  return (
  <Tabs>
    <TabList>
      <Tab>Title 1</Tab>
      <Tab>Title 2</Tab>
    </TabList>

    <TabPanel style={{borderLeft:"solid 1px ",borderRight:"solid 1px ",borderBottom:"solid 1px " ,marginTop:"-10px"}}>
      <h2>Any content 1</h2>
    </TabPanel>
    <TabPanel style={{borderLeft:"solid 1px ",borderRight:"solid 1px ",borderBottom:"solid 1px "}}>
      <h2>Any content 2</h2>
    </TabPanel>
  </Tabs>
);
}
export default Menu;
