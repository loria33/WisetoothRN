import mysql.connector

from mysql.connector import Error
import argparse
import tkinter as tk
from datetime import datetime

from PIL import ImageTk, Image

import urllib.request

class database_handler():

    
    def __init__(self, ip, database_name, user, pwd):

        try:
            self.connection = mysql.connector.connect(host=ip,
                                                database=database_name,
                                                user=user,
                                                password=pwd)
            self.cursor = self.connection.cursor()
            if self.connection.is_connected():
                db_Info = self.connection.get_server_info()
                print("Connected to MySQL Server version ", db_Info)
                
                self.cursor.execute("select database();")
                record = self.cursor.fetchone()
                print("You're connected to database: ", record)
                print('Tables')
                self.cursor.execute("SHOW TABLES")
                tables = []
                for table_name in self.cursor:
                    tables.append(table_name[0])
                    print(table_name[0])
                self.tables = tables
                '''num_fields = len(self.cursor.description)
                field_names = [i[0] for i in self.cursor.description]
                for field in field_names:
                    print(field)'''
                

        except Error as e:
            print("Error while connecting to MySQL", e)

    def get_tables(self):
        return self.tables
    

    def write_fake_data(self):
        
        manufacturerModel_id = 1
        user_id = 195


        patient_age = 53
        patient_gender = 'male'
        patient_name ='dffdsgfdsgsgsdf'
        q_type = 'failure'
        tooth_num = 23
        answer_dict = '{"surgeryInformationPlacement":{"methode":"Manually driven","immediatePlacementCondition":["Local chronic infection"],"boneQuality":"II","implantPlacementLevel":"Sub-crsetal","placementTime":"Delayed placement","softTissueBiotype":"Thin","implantPlacementProtocol":"Two stages","wasPrimaryStabilityAchived":"Yes","ridgeAugmentation":"Block","gtrMembraneUsed":"Non-resorbable material","materialOfBoneGraftUsed":"NA","sinusFloorElevation":"Internal without implant placement","softTissueProcedures":"Connective tissue graft","torque":"56","singleStage":""},"sutureRemovalStageInformation":{"suturesRemovedBy":"mr a","atTheTimeOfSutureRemoval":"Maxillary sinus complications","sutureRemovalDate":"2023-04-24"},"secondStageSurgeryInformation":{"secondStagePerformedBy":"mr b","secondStageDate":"2023-04-29","softTissueAugmentationNeeded":"Connective tissue graft","uncoveryTechnique":"With flap technique","assessmentOfHygiene":"Good","isqValue":"0","healingCap":{"size":"5","height":"6"},"secondStagecondition":["Exposure of implant threads"],"boneLoss":"2-4mm","manufacturerName":"Paltop"},"prostheticStageConfirmQuestion":"yes","prostheticStepsInformation":\{\}}'
        # Current datetime
        now = datetime.now()
        # Format datetime
        formatted_now = now.strftime('%Y-%m-%d %H:%M:%S')
        
        '''self.cursor.execute("INSERT INTO ImplantLabels (id, label, imagePath, imageUrl, implantId, userId, length, diameter, manufacturerModelId, lot, createdAt, updatedAt)   VALUES ({}, NULL, '', '', {}, {}, 2.0, 2.0,{}, 'Z', %s, %s)".format(implant_lbl_id,  implant_id, user_id, manufacturerModel_id, formatted_now, formatted_now))
        self.cursor.execute('INSERT INTO Implants (id, createdAt, updatedAt) VALUES ({}, %s, %s)'.format(implant_id, formatted_now, formatted_now))
        self.cursor.execute('INSERT INTO Patients (id, age, gender, name, createdAt, updatedAt) VALUES ({}, {}, {}, {}, %s, %s)'.format(patient_id, patient_age, patient_gender, patient_name, formatted_now, formatted_now))
        self.cursor.execute('INSERT INTO Visits (id, patientId, userId, createdAt, updatedAt) VALUES ({}, {}, {}, %s, %s)'.format(visit_id, patient_id, user_id, formatted_now, formatted_now))
        self.cursor.execute('INSERT INTO Questionaires (id, questionaireType, installId, createdAt, updatedAt) VALUES ({}, {}, {}, %s, %s)'.format(q_id, q_type, inastall_id, formatted_now, formatted_now))
        self.cursor.execute('INSERT INTO Installs (id, implantId, visitId, toothNum, createdAt, updatedAt) VALUES ({}, {}, {}, {}, %s, %s)'.format(inastall_id, implant_id, visit_id, tooth_num, formatted_now, formatted_now))'''


        self.cursor.execute(
            "INSERT INTO Implants (createdAt, updatedAt) VALUES (%s, %s)",
            (formatted_now, formatted_now))
        
        self.connection.commit()
        implant_id = self.cursor.lastrowid
        print(implant_id)

        self.cursor.execute(
            "INSERT INTO ImplantLabels (label, imagePath, imageUrl, implantId, userId, length, diameter, manufacturerModelId, lot, createdAt, updatedAt) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (None, '', '', implant_id, user_id, 2.0, 2.0, manufacturerModel_id, 'Z', formatted_now, formatted_now))

        self.connection.commit()
        implant_lbl_id = self.cursor.lastrowid
        print(implant_lbl_id)

       

        self.cursor.execute(
            "INSERT INTO Patients (age, gender, name, createdAt, updatedAt) VALUES (%s, %s, %s, %s, %s)",
            (patient_age, patient_gender, patient_name, formatted_now, formatted_now))

        self.connection.commit()
        patient_id = self.cursor.lastrowid
        print(patient_id)

        self.cursor.execute(
            "INSERT INTO Visits (patientId, userId, createdAt, updatedAt) VALUES (%s, %s, %s, %s)",
            (patient_id, user_id, formatted_now, formatted_now))
        
        self.connection.commit()
        visit_id = self.cursor.lastrowid
        print(visit_id)

        self.cursor.execute(
            "INSERT INTO Installs (implantId, visitId, toothNum, createdAt, updatedAt) VALUES ( %s, %s, %s, %s, %s)",
            (implant_id, visit_id, tooth_num, formatted_now, formatted_now))
        
        self.connection.commit()
        install_id = self.cursor.lastrowid
        print(install_id)

        self.cursor.execute(
            "INSERT INTO Questionaires (questionaireType, answers, installId, createdAt, updatedAt) VALUES (%s, %s, %s, %s, %s)",
            (q_type, answer_dict, install_id, formatted_now, formatted_now))
        
        self.connection.commit()
        q_id = self.cursor.lastrowid
        print(q_id)

        

    
    def print_data(self, table_name):
        self.cursor.execute("SELECT * FROM {}".format(table_name))
        # fetch all the matching rows 
        result = self.cursor.fetchall()
        field_names = [i[0] for i in self.cursor.description]
        for field_i in range(len(field_names)):
            field = field_names[field_i]
            print('{} = {}'.format(field, result[0][field_i]))
        # loop through the rows
        cnt = 0
        for row in result:
            cnt += 1
            if cnt == 10:
                break
            print(row)
            print("\n")

    def close_connection(self):
        self.cursor.close()
        self.connection.close()
        print("MySQL connection is closed")


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--ip', type=str, default='104.155.113.73')
    parser.add_argument('--database_name', type=str, default='wisetooth')
    parser.add_argument('--user', type=str, default='root')
    parser.add_argument('--pwd', type=str, default='EgsDKjK5HjsJlGoz')
    args = parser.parse_args()

    ip = args.ip
    database_name = args.database_name
    user = args.user
    pwd = args.pwd
    database_handler = database_handler(ip, database_name, user, pwd)

    tables = ['ImplantLabels','Implants','Visits','Patients', 'Users', 'Installs','Questionaires' ]
    #tables = ['ImplantLabels' ]
    print(database_handler.get_tables())
    for table in tables: #database_handler.get_tables():
        print('--------------- Printing Data from {} ---------------'.format(table))
        database_handler.print_data(table)
    
        
    database_handler.write_fake_data()
    database_handler.close_connection()
