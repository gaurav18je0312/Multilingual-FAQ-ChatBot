import marqo
import json
import os

class MarqoSetup:
    
    def __init__(self):
        self.marqo_url = "http://localhost:8882"
        self.index_name = "gem"
        self.folder_name = os.path.join(os.getcwd(), "data")
        self.fresh_index = True
        self.marqo_client = marqo.Client(url=self.marqo_url)
        
    def JSONDataPreprocessing(self, data):
        result = []
        ques = []
        for q in data:
            if q["question"] not in ques:
                result.append(q)
                ques.append(q["question"])
                
        return result
        
    def createIndex(self):
        try:
            self.marqo_client.index(self.index_name).delete()
            print("Existing Index successfully deleted.")
        except Exception:
            print("Index does not exist. Creating new index")
        self.marqo_client.create_index(self.index_name, model="hf/multilingual-e5-large")
        print(f"Index {self.index_name} created.")
        
    def readJSONFromFolder(self):
        result = []
        files = os.listdir(self.folder_name)
        json_files = [file for file in files if file.endswith('.json')]
        for json_file in json_files:
            file_path = os.path.join(self.folder_name, json_file)
            with open(file_path, 'r') as file:
                data = json.load(file)
            data = data["FAQ"]
            result.extend(data)
        result = self.JSONDataPreprocessing(result)
        self.load_documents(result)
        
    def load_documents(self, data):
        try:
            chunked_data = []
            for i in range(0, len(data), 64):
                chunked_data.append(data[i:i+64])
            for chunks in chunked_data:
                load_data = []
                for ind in chunks:
                    tmp = {
                        "Description": f'{ind["question"]} | {ind["answer"]}',
                        "_id": ind["id"]
                    }
                    load_data.append(tmp)
                tensor_fields=["Description"]
                self.marqo_client.index(self.index_name).add_documents(documents=load_data, tensor_fields=tensor_fields)
            print("Data loaded")
        except Exception as e:
            print(e)
            return
        
    def get_result(self, search_text):
        result = self.marqo_client.index(self.index_name).search(search_text)
        print(result)
        result = result["hits"]
        matched_ids = []
        for i in result:
            matched_ids.append(i["_id"])
        return matched_ids[:5]
        
if __name__ == "__main__":
    mq = MarqoSetup()
    mq.createIndex()
    mq.readJSONFromFolder()
    print(mq.get_result("GPRS charges"))
        