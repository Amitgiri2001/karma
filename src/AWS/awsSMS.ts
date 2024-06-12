import AWS from 'aws-sdk';

// Update AWS configuration
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    region: process.env.AWS_SNS_REGION!
});

function awsOTP(phoneNumber: string, message: string): Number {
    const sns = new AWS.SNS();

    const params: AWS.SNS.PublishInput = {
        Message: message,
        PhoneNumber: phoneNumber,
        MessageAttributes: {
            'AWS.SNS.SMS.SMSType': {
                DataType: 'String',
                StringValue: 'Transactional' // Choose between 'Promotional' or 'Transactional'
            }
        }
    };

    sns.publish(params, (err: any, data: any) => {
        if (err) {
            console.error('Error sending SMS:', err);
            return 0;
        } else {
            console.log('SMS sent successfully:', data.MessageId);
            return 1;
        }
    });

    return 1;
}

export default awsOTP;
