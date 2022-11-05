import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CaretRight, X } from 'phosphor-react';
import qs from 'qs';

import data from './data.json';
import Table from './Table';

const Section = styled.section`
  background: linear-gradient(-45deg, #203028, #101f18);
  min-height: 100%;
`;

const Wrapper = styled.div`
  --accent: rgba(163, 89, 29, 0.76);
  display: block;
  max-width: 520px;
  margin: 0 auto;
  padding: 24px;
  border: 15px solid transparent; /* control the offset of the lines */
  outline: 2px solid var(--accent); /* adjust the 2px here */
  outline-offset: -10px; /* control the offset of the rectangle */
  background: linear-gradient(var(--accent) 0 0) top, linear-gradient(var(--accent) 0 0) left,
    linear-gradient(var(--accent) 0 0) bottom, linear-gradient(var(--accent) 0 0) right;
  background-size: 200% 2px, 2px 200%; /* adjust the 2px here */
  background-origin: padding-box;
  background-repeat: no-repeat;
  height: 100%;
`;

const Column = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-gap: 24px;
  color: #e9e9e9;

  h1 {
    font-size: 32px;
    text-align: center;
  }
`;

const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-gap: 8px;
  align-items: center;
  font-weight: 600;
  color: #cfcfcf;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  padding: 12px 16px;
  font-size: 16px;
  appearance: none;
  width: 100%;
  border: 2px solid #fff6;
  background: #fff3;
  border-radius: 6px;
  color: #fff;

  &:focus {
    outline: none;
    background: #fff4;
    border-color: #fff;
  }

  &::placeholder {
    color: #999;
  }

  &:focus::placeholder {
    color: #ccc;
  }
`;

const Modal = styled.dialog`
  border: 0;
  padding: 24px;
  border-radius: 6px;
  background: #fff;
  position: fixed;
  z-index: 1000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  width: 85%;
  max-width: 480px;

  p:first-of-type {
    font-size: 18px;
    margin-bottom: 12px;
    text-align: center;
  }

  h1 {
    font-size: 32px;
    text-align: center;
    font-weight: 900;
  }

  p {
    line-height: 1.5;
  }
`;

const ModalHeader = styled.header`
  display: flex;
  justify-content: flex-end;

  button {
    appearance: none;
    line-height: 0;
    border: 0;
    background: transparent;
  }
`;

const ScrollableList = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-gap: 8px;
`;

const Card = styled.div`
  border: 1px solid #fffa;
  padding: 16px 12px;
  border-radius: 6px;
  background: #fff1;
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    letter-spacing: 0.5px;
  }

  span:last-child {
    font-weight: 800;
  }
`;

const shuffle = (array) => {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const App = () => {
  const query = qs.parse(window.location.search, { ignoreQueryPrefix: true });
  const [search, setSearch] = useState(query.q || '');
  const [selectedId, setSelectedId] = useState<number | null>(
    query.id ? parseInt(query.id, 10) : null,
  );

  useEffect(() => {
    if (search) {
      const currentQuery = qs.parse(window.location.search, { ignoreQueryPrefix: true });
      const newQuery = qs.stringify({ ...currentQuery, q: search }, { addQueryPrefix: true });
      history.replaceState({}, null, `${newQuery}`);
    } else {
      const currentQuery = qs.parse(window.location.search, { ignoreQueryPrefix: true });
      delete currentQuery.q;
      const newQuery = qs.stringify(currentQuery, { addQueryPrefix: true });
      history.replaceState({}, null, `/${newQuery}`);
    }
  }, [search]);

  useEffect(() => {
    if (selectedId) {
      const currentQuery = qs.parse(window.location.search, { ignoreQueryPrefix: true });
      const newQuery = qs.stringify({ ...currentQuery, id: selectedId }, { addQueryPrefix: true });
      history.replaceState({}, null, `${newQuery}`);
    } else {
      const currentQuery = qs.parse(window.location.search, { ignoreQueryPrefix: true });
      delete currentQuery.id;
      const newQuery = qs.stringify(currentQuery, { addQueryPrefix: true });
      history.replaceState({}, null, `/${newQuery}`);
    }
  }, [selectedId]);

  const selectedGuest = data.find((guest) => guest.id === selectedId);
  const guestsSharingTable = shuffle(data.filter((guest) => guest.table === selectedGuest?.table));

  return (
    <Section>
      <Wrapper>
        <Column>
          <h1>Find Your Table</h1>
          <InputWrapper>
            <label htmlFor="id">Search or scroll to find your name</label>
            <Input
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              type="text"
              id="search"
              autoComplete="family-name"
              placeholder="Search your first or last name"
            />
          </InputWrapper>
          <ScrollableList>
            {data
              .filter((g) => {
                return (
                  g.firstName.toLowerCase().includes(search.toLowerCase()) ||
                  g.lastName.toLowerCase().includes(search.toLowerCase())
                );
              })
              .map((item) => (
                <Card key={`guest--${item.id}`} onClick={() => setSelectedId(item.id)}>
                  <div>
                    {item.firstName && <span>{item.firstName}</span>} <span>{item.lastName}</span>
                  </div>
                  <CaretRight color="#fff" weight="bold" />
                </Card>
              ))}
          </ScrollableList>
        </Column>
      </Wrapper>
      {selectedId !== null && (
        <Modal open>
          <ModalHeader>
            <button>
              <X onClick={() => setSelectedId(null)} weight="bold" size={24} />
            </button>
          </ModalHeader>
          <p>
            {selectedGuest.firstName && <span>{selectedGuest.firstName}</span>}{' '}
            <span>{selectedGuest.lastName}</span>
          </p>
          <h1>{selectedGuest.table > 0 ? `Table ${selectedGuest.table}` : 'Head Table'}</h1>
          <Table />
          <div />
          <p>
            You're sharing a table with{' '}
            {guestsSharingTable
              .filter(({ id }) => id !== selectedGuest.id)
              .slice(0, 3)
              .map((guest, idx) => (
                <>
                  <strong key={guest.id}>
                    {guest.firstName && <span>{guest.firstName}</span>}{' '}
                    <span>{guest.lastName}</span>
                  </strong>
                  {idx !== 2 ? `, ${idx === 1 ? 'and ' : ''}` : ''}
                </>
              ))}
            , to name a few
          </p>
        </Modal>
      )}
    </Section>
  );
};

export default App;
