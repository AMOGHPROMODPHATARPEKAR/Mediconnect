import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
  } from '@react-email/components';
  

  
  export default function AppointmentEmail({ username, date, doctorName }) {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <title>Booked the Appointment successfully</title>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Preview>Successfully booked </Preview>
        <Section>
          <Row>
            <Heading as="h2">Hello {username},</Heading>
          </Row>
          <Row>
            <Text>
              Thank you for booking the Appointment with us. Follow the below schedule
            </Text>
          </Row>
          <Row>
            <Text>Doctor Name: {doctorName}</Text> 
          </Row>
          <Row>
            <Text>
                On {date}
            </Text>
          </Row>
          
        </Section>
      </Html>
    );
  }