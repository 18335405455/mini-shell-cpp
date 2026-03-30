CXX = g++
CXXFLAGS = -std=c++11 -Wall

TARGET = mini_shell

SRC = src/main.cpp src/parser.cpp src/executor.cpp src/pipe_executor.cpp

$(TARGET): $(SRC)
	$(CXX) $(CXXFLAGS) $(SRC) -o $(TARGET)

clean:
	rm -f $(TARGET)