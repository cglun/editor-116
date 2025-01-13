import { getCamera, getCube, getScene } from '../../three/threeInit';
import { setClassName } from '../../app/utils';

import { getThemeColor, SPACE } from '../../app/config';
import {
  Accordion,
  Button,
  Card,
  Form,
  InputGroup,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {
  Camera,
  Mesh,
  Object3D,
  Object3DEventMap,
  PerspectiveCamera,
  Vector3,
} from 'three';
import ObjectProperty from './ObjectProperty';

export default function OutlineView() {
  type sceneType = Object3D<Object3DEventMap>[];
  const [sceneList, setSceneList] = useState<sceneType>();

  useEffect(() => {
    const children = getScene().children;

    setSceneList(children);
  }, []);

  function getLogo(item: any) {
    let logo = 'hexagon';
    if (item.isMesh) {
      logo = 'box';
    }

    if (item.isGroup) {
      logo = 'collection';
    }

    if (item.isLight) {
      logo = 'lightbulb';
    }
    return <i className={setClassName(logo)}></i>;
  }

  function Menu(sceneList: sceneType, show: string) {
    return sceneList.map((item, index) => {
      return (
        <ListGroupItem
          key={index}
          style={{ display: show, cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();

            //展开
            if (item.children.length > 0) {
              const current = e.currentTarget.children[1];

              const expandButton =
                e.currentTarget.children[0].children[1].children[0];

              {
                current.getAttribute('style')?.includes('display:block')
                  ? current.setAttribute('style', 'display:none')
                  : current.setAttribute('style', 'display:block');
              }
              {
                expandButton
                  .getAttribute('class')
                  ?.includes('bi bi-plus-square')
                  ? expandButton.setAttribute(
                      'class',
                      setClassName('dash-square'),
                    )
                  : expandButton.setAttribute(
                      'class',
                      setClassName('plus-square'),
                    );
              }

              // current.setAttribute('style', 'display:block');
            }
          }}
        >
          <div className="d-flex justify-content-between">
            <div>
              {getLogo(item)} {SPACE}
              {item.name.trim().length === 0 ? item.type : item.name}
            </div>
            <div>
              {item.children.length > 0 && (
                <i className={setClassName('plus-square')}></i>
              )}
            </div>
          </div>
          {item.children.length > 0 && Menu(item.children, 'none')}
        </ListGroupItem>
      );
    });
  }
  function cameraDiv() {
    const camera = getCamera();
    if (camera && camera.isCamera) {
      return (
        <ListGroup.Item
          as={'button'}
          className=" d-flex justify-content-between "
        >
          <div>
            <i className={setClassName('camera-reels')}></i>
            {SPACE}相机
          </div>
        </ListGroup.Item>
      );
    }
  }
  let [box, setBox] = useState(new Mesh());
  return (
    <Accordion defaultActiveKey={['0', '1']} alwaysOpen>
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <i className={setClassName('archive')}></i>
          <span className="px-2">大纲视图</span>
        </Accordion.Header>
        <Accordion.Body className="outline-view">
          <ListGroup>
            {cameraDiv()}
            {sceneList && Menu(sceneList, 'block')}
          </ListGroup>
        </Accordion.Body>
      </Accordion.Item>
      <Button
        onClick={() => {
          setBox(getCube());
        }}
      >
        选择box
      </Button>

      <ObjectProperty selectedObj={box} />
    </Accordion>
  );
}
//分配给类型“IntrinsicAttributes & Camera