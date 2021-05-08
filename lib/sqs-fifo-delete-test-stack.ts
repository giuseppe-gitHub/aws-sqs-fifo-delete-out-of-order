import * as sqs from '@aws-cdk/aws-sqs';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { Duration } from '@aws-cdk/core';

export class SqsFifoDeleteTestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this,'my-fifo-queue',{
      fifo: true,
      visibilityTimeout: Duration.seconds(15),
      contentBasedDeduplication: true
    });

    const lambdaRead = new lambda.Function(this, 'readAndDeleteFromQueue', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambdas'),
      handler: 'readAndDeleteFromQueue.handler',
      environment: {
        QUEUE_URL: queue.queueUrl
      } 
    });

    queue.grantConsumeMessages(lambdaRead);


    const lambdaWrite = new lambda.Function(this, 'write2MessagesToQueue', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambdas'),
      handler: 'write2MessagesToQueue.handler',
      environment: {
        QUEUE_URL: queue.queueUrl
      } 
    });

    queue.grantSendMessages(lambdaWrite);
  }
}
